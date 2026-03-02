import { supabase } from "./supabase";

export type SiteContent = {
    section: string;
    key: string;
    value: string;
};

export type Project = {
    id: number;
    title: string;
    category: string;
    description: string;
    year: string;
    image: string;
    seo_alt: string;
    sort_order: number;
    gallery: { url: string; alt: string }[];
};

export type Testimonial = {
    id: number;
    name: string;
    project: string;
    quote: string;
    sort_order: number;
};

export type OfferStep = {
    id: string; // Changed to string for component compatibility
    step_number: string;
    title: string;
    description: string;
};

export type HeroSlide = {
    id: number;
    image: string;
    seo_alt: string;
    date: string;
    sort_order: number;
};

export async function getSiteContent(section?: string) {
    let query = supabase.from("site_content").select("*");
    if (section) {
        query = query.eq("section", section);
    }
    const { data, error } = await query;
    if (error) throw error;

    // Transform to key-value map for easier use
    return (data as SiteContent[]).reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = {};
        acc[item.section][item.key] = item.value;
        return acc;
    }, {} as Record<string, Record<string, string>>);
}

export async function updateSiteContent(updates: SiteContent[]) {
    const { error } = await supabase
        .from("site_content")
        .upsert(updates, { onConflict: "section,key" });
    if (error) throw error;
}

// 2. Projects
export async function getProjects() {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as Project[];
}

export async function upsertProject(project: Partial<Project>) {
    if (project.id) {
        // Explicitly remove ID from the data we're updating
        const { id, ...updateData } = project;
        const { data, error } = await supabase
            .from("projects")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) throw error;
        return data?.[0] as Project;
    } else {
        const { data, error } = await supabase
            .from("projects")
            .insert([project])
            .select();

        if (error) throw error;
        return data?.[0] as Project;
    }
}

export async function deleteProject(id: number) {
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

// 3. Testimonials
export async function getTestimonials() {
    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as Testimonial[];
}

export async function upsertTestimonial(testimonial: Partial<Testimonial>) {
    if (testimonial.id) {
        const { id, ...updateData } = testimonial;
        const { data, error } = await supabase
            .from("testimonials")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) throw error;
        return data?.[0] as Testimonial;
    } else {
        const { data, error } = await supabase
            .from("testimonials")
            .insert([testimonial])
            .select();

        if (error) throw error;
        return data?.[0] as Testimonial;
    }
}

export async function deleteTestimonial(id: number) {
    const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

// 4. Offer Steps
export async function getOfferSteps() {
    const { data, error } = await supabase
        .from("offer_steps")
        .select("*")
        .order("step_number", { ascending: true });
    if (error) throw error;
    return (data || []) as any[]; // Let component handle casting for now
}

export async function upsertOfferStep(step: Partial<OfferStep>) {
    // Check if we have a real numeric ID
    const dbId = step.id && !isNaN(Number(step.id)) ? Number(step.id) : null;

    if (dbId) {
        const { id, ...updateData } = step;
        const { data, error } = await supabase
            .from("offer_steps")
            .update(updateData)
            .eq("id", dbId)
            .select();

        if (error) throw error;
        return data?.[0];
    } else {
        // If it was a mock ID like "01", remove it before insert
        const { id, ...insertData } = step;
        const { data, error } = await supabase
            .from("offer_steps")
            .insert([insertData])
            .select();

        if (error) throw error;
        return data?.[0];
    }
}

export async function deleteOfferStep(id: number) {
    const { error } = await supabase
        .from("offer_steps")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

// 5. Hero Slides
export async function getHeroSlides() {
    const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as HeroSlide[];
}

export async function upsertHeroSlide(slide: Partial<HeroSlide>) {
    if (slide.id) {
        const { id, ...updateData } = slide;
        // Clean up metadata before update
        const cleanData = {
            image: updateData.image,
            seo_alt: updateData.seo_alt,
            date: updateData.date,
            sort_order: updateData.sort_order,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from("hero_slides")
            .update(cleanData)
            .eq("id", id)
            .select();

        if (error) throw error;
        return data?.[0] as HeroSlide;
    } else {
        // Strip ID and timestamps for new slide
        const { id, created_at, updated_at, ...insertData } = slide as any;
        const { data, error } = await supabase
            .from("hero_slides")
            .insert([insertData])
            .select();

        if (error) throw error;
        return data?.[0] as HeroSlide;
    }
}

export async function updateHeroSlides(slides: HeroSlide[]) {
    // Clean data for upsert
    const cleanSlides = slides.map(slide => {
        const { created_at, updated_at, ...data } = slide as any;
        return {
            ...data,
            updated_at: new Date().toISOString()
        };
    });

    const { error } = await supabase
        .from("hero_slides")
        .upsert(cleanSlides, { onConflict: "id" });

    if (error) throw error;
}

export async function deleteHeroSlide(id: number) {
    const { error } = await supabase
        .from("hero_slides")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

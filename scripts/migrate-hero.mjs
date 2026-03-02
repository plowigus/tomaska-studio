import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log("🚀 Starting incremental migration (adding Hero slides and About images)...");

    // 1. Add new keys to site_content
    console.log("📝 Adding about_image_* keys to site_content...");
    const newContent = [
        { section: 'about', key: 'about_image_1', value: '/05. Męski Azyl/Detal/DRP_174.jpg' },
        { section: 'about', key: 'about_image_2', value: '/05. Męski Azyl/Detal/DRP_175.jpg' },
        { section: 'about', key: 'about_image_3', value: '/05. Męski Azyl/Detal/DRP_176.jpg' }
    ];

    for (const item of newContent) {
        const { error } = await supabase
            .from('site_content')
            .upsert(item, { onConflict: 'section,key' });

        if (error) {
            console.error(`❌ Error adding ${item.key}:`, error.message);
        } else {
            console.log(`✅ ${item.key} added/updated.`);
        }
    }

    // 2. Add hero_slides data (Note: This assumes the table already exists via SQL Editor, 
    // or we're just upserting if it was created. Since we can't CREATE TABLE via this JS client easily 
    // without deeper permissions, we'll try to insert and see if it works.)
    console.log("🏗️ Seeding hero_slides...");
    const heroSlides = [
        { image: '/05. Męski Azyl/DRP_42.jpg', seo_alt: 'Nowoczesny męski azyl w Kaliszu', date: "'24", sort_order: 1 },
        { image: '/06. Spokojna przestrzeń/DRP_65.jpg', seo_alt: 'Spokojna przestrzeń - Tomaska Studio', date: "'24", sort_order: 2 },
        { image: '/07. Przytulne wnętrze/20240620_211601.jpg', seo_alt: 'Przytulne wnętrze domu - Kalisz', date: "'23", sort_order: 3 },
        { image: '/08. Nowoczesna forma/1_4.jpg', seo_alt: 'Nowoczesna forma apartamentu', date: "'23", sort_order: 4 }
    ];

    const { error: heroError } = await supabase.from('hero_slides').upsert(heroSlides);
    if (heroError) {
        console.error("❌ hero_slides error (Does the table exist?):", heroError.message);
        console.log("💡 Tip: You still need to run the CREATE TABLE block from migration_hero.sql in Supabase SQL Editor once.");
    } else {
        console.log("✅ hero_slides seeded.");
    }

    console.log("🏁 Migration script finished.");
}

runMigration();

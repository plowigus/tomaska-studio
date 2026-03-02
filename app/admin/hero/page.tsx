"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, Image as ImageIcon, GripVertical, CheckCircle, AlertCircle } from "lucide-react";
import { getHeroSlides, updateHeroSlides, deleteHeroSlide, type HeroSlide } from "@/app/src/lib/cms";
import { UploadButton } from "@/app/src/lib/uploadthing";

export default function HeroManager() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        loadSlides();
    }, []);

    async function loadSlides() {
        try {
            const data = await getHeroSlides();
            setSlides(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const addSlide = () => {
        const newSlide: Partial<HeroSlide> = {
            image: "",
            seo_alt: "",
            date: "'24",
            sort_order: slides.length + 1
        };
        setSlides([...slides, newSlide as HeroSlide]);
    };

    const updateSlide = (index: number, updates: Partial<HeroSlide>) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], ...updates };
        setSlides(newSlides);
    };

    const removeSlide = async (index: number, id?: number) => {
        if (id) {
            if (!confirm("Czy na pewno chcesz usunąć ten slajd?")) return;
            try {
                await deleteHeroSlide(id);
            } catch (err) {
                console.error(err);
                return;
            }
        }
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
    };

    const saveAll = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            // Filter out slides without images if necessary, or just save all
            await updateHeroSlides(slides);
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
            await loadSlides(); // Reload to get IDs for new items
        } catch (err) {
            console.error("❌ Hero bulk save error:", err);
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-20" size={48} /></div>;

    return (
        <div className="max-w-5xl space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight">Karuzela Hero</h1>
                    <p className="mt-2 text-black/50 font-serif">Zarządzaj zdjęciami na głównej stronie.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={addSlide}
                        className="flex items-center gap-2 bg-alabaster text-black border border-black/5 px-6 py-3 rounded-full hover:bg-black/5 transition-all"
                    >
                        <Plus size={18} />
                        Dodaj slajd
                    </button>
                    <button
                        onClick={saveAll}
                        disabled={saving}
                        className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-black/90 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? "Zapisywanie..." : "Zapisz wszystko"}
                    </button>
                </div>
            </header>

            {status === "success" && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <CheckCircle className="shrink-0" size={20} />
                    <span>Slajd został zapisany pomyślnie!</span>
                </div>
            )}

            {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <AlertCircle className="shrink-0" size={20} />
                    <span>Wystąpił błąd podczas zapisywania. Sprawdź konsolę przeglądarki.</span>
                </div>
            )}

            <div className="grid gap-6">
                {slides.map((slide, index) => (
                    <div key={slide.id || `new-${index}`} className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Preview / Upload */}
                            <div className="w-full md:w-64 h-48 bg-alabaster rounded-xl overflow-hidden relative border border-black/5 shrink-0">
                                {slide.image ? (
                                    <img src={slide.image} alt={slide.seo_alt} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-black/20">
                                        <ImageIcon size={48} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res: any) => {
                                            if (res?.[0]) updateSlide(index, { image: res[0].url });
                                        }}
                                        content={{
                                            button: "Wgraj zdjęcie"
                                        }}
                                        appearance={{
                                            button: "bg-black text-white hover:bg-black/90 transition-all rounded-full px-6 py-2 text-xs font-bold shadow-lg"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">SEO Alt Text</label>
                                        <input
                                            type="text"
                                            value={slide.seo_alt}
                                            onChange={(e) => updateSlide(index, { seo_alt: e.target.value })}
                                            placeholder="Opis dla Google..."
                                            className="w-full bg-alabaster border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Rok (np. '24)</label>
                                        <input
                                            type="text"
                                            value={slide.date}
                                            onChange={(e) => updateSlide(index, { date: e.target.value })}
                                            className="w-full bg-alabaster border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-black/5 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Kolejność</label>
                                        <input
                                            type="number"
                                            value={slide.sort_order}
                                            onChange={(e) => updateSlide(index, { sort_order: parseInt(e.target.value) })}
                                            className="w-16 bg-alabaster border-none rounded-lg p-2 text-sm text-center"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => removeSlide(index, slide.id)}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

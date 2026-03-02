"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Quote, Trash2, Edit2, X, Save, AlertCircle } from "lucide-react";
import { getTestimonials, upsertTestimonial, deleteTestimonial, type Testimonial } from "@/app/src/lib/cms";
import { cn } from "@/app/src/lib/utils";

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const lenis = (window as any).__lenis;
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            lenis?.stop();
        } else {
            document.body.style.overflow = "unset";
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = "unset";
            lenis?.start();
        };
    }, [isModalOpen]);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            setLoading(true);
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (testimonial?: Testimonial) => {
        setEditingTestimonial(testimonial || {
            name: "",
            project: "",
            quote: "",
            sort_order: testimonials.length + 1
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTestimonial(null);
        setError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTestimonial) return;

        setIsSaving(true);
        setError(null);
        try {
            await upsertTestimonial(editingTestimonial);
            await loadTestimonials();
            handleCloseModal();
        } catch (err: any) {
            console.error("❌ Testimonial save error details:", {
                message: err.message,
                details: err.details,
                hint: err.hint,
                code: err.code,
                fullError: err
            });
            setError(err.message || "Wystąpił błąd podczas zapisywania.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Czy na pewno chcesz usunąć tę opinię?")) return;

        try {
            await deleteTestimonial(id);
            await loadTestimonials();
        } catch (err) {
            console.error(err);
            alert("Błąd podczas usuwania opinii.");
        }
    };

    if (loading && testimonials.length === 0) return <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-20" size={48} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">Opinie</h1>
                    <p className="mt-2 text-charcoal/50 font-serif">Zarządzaj referencjami od Twoich klientów.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-black/80 transition-all font-sans text-sm tracking-wide shadow-lg shadow-black/10"
                >
                    <Plus size={18} />
                    DODAJ OPINIĘ
                </button>
            </header>

            <div className="grid gap-6">
                {testimonials.map((t) => (
                    <div key={t.id} className="group flex items-start gap-8 p-10 bg-white border border-black/5 rounded-4xl hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                        <div className="shrink-0 p-5 bg-alabaster rounded-3xl">
                            <Quote className="text-charcoal/20" size={40} />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-serif font-bold">{t.name}</h3>
                                <span className="text-[10px] font-sans text-charcoal/40 font-bold px-4 py-1.5 bg-alabaster rounded-full tracking-[0.2em] uppercase">{t.project}</span>
                            </div>
                            <p className="text-xl font-serif italic text-charcoal/70 leading-relaxed font-light">„{t.quote}”</p>
                        </div>

                        <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => handleOpenModal(t)}
                                className="p-4 bg-alabaster hover:bg-black hover:text-white rounded-2xl transition-all duration-300"
                            ><Edit2 size={18} /></button>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="p-4 bg-alabaster hover:bg-red-500 hover:text-white text-red-500 rounded-2xl transition-all duration-300"
                            ><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}

                {testimonials.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-black/10 rounded-[3rem]">
                        <Quote className="mx-auto mb-4 opacity-10" size={48} />
                        <p className="text-black/30 font-serif italic text-lg">Brak opinii. Kliknij "DODAJ OPINIĘ" aby zacząć.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div
                        data-lenis-prevent
                        className="relative bg-white w-full max-w-2xl rounded-4xl shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
                    >
                        <button onClick={handleCloseModal} className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-serif font-bold mb-8">
                            {editingTestimonial?.id ? "Edytuj opinię" : "Nowa opinia"}
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-100 text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Imię i Nazwisko / Firma</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingTestimonial?.name}
                                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial!, name: e.target.value })}
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Projekt</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingTestimonial?.project}
                                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial!, project: e.target.value })}
                                        placeholder="np. Apartament w Kaliszu"
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Kolejność wyświetlania</label>
                                <input
                                    required
                                    type="number"
                                    value={editingTestimonial?.sort_order}
                                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial!, sort_order: parseInt(e.target.value) })}
                                    className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Treść opinii</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={editingTestimonial?.quote}
                                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial!, quote: e.target.value })}
                                    className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5 resize-none italic"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={isSaving}
                                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 rounded-full font-bold hover:bg-black/80 transition-all disabled:opacity-50 text-base tracking-wide shadow-xl shadow-black/10"
                                >
                                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                    {isSaving ? "ZAPISYWANIE..." : "ZAPISZ OPINIĘ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

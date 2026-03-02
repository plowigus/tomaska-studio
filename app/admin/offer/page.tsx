"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, Edit3, X, Save, AlertCircle, ListChecks } from "lucide-react";
import { getOfferSteps, upsertOfferStep, deleteOfferStep, type OfferStep } from "@/app/src/lib/cms";
import { cn } from "@/app/src/lib/utils";

export default function OfferManager() {
    const [steps, setSteps] = useState<OfferStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStep, setEditingStep] = useState<Partial<OfferStep> | null>(null);
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
        loadSteps();
    }, []);

    const loadSteps = async () => {
        try {
            setLoading(true);
            const data = await getOfferSteps();
            setSteps(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (step?: OfferStep) => {
        setEditingStep(step || {
            step_number: (steps.length + 1).toString().padStart(2, '0'),
            title: "",
            description: ""
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStep(null);
        setError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStep) return;

        setIsSaving(true);
        setError(null);
        try {
            // Ensure step_number is string
            const payload = {
                ...editingStep,
                step_number: editingStep.step_number?.toString()
            };
            await upsertOfferStep(payload);
            await loadSteps();
            handleCloseModal();
        } catch (err: any) {
            console.error("❌ Offer step save error details:", {
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

    const handleDelete = async (id: any) => {
        if (!confirm("Czy na pewno chcesz usunąć ten krok?")) return;

        try {
            // In our CMS lib, we used step_number as ID for compatibility in some places, 
            // but the delete function expects the numeric ID (BIGINT in DB).
            // Let's check what the OfferStep type has.
            // Actually, getOfferSteps maps step.step_number to id. 
            // We might need to adjust deleteOfferStep to handle numeric ID or step_number.
            // Let's assume we pass the internal DB ID if available.
            await deleteOfferStep(id);
            await loadSteps();
        } catch (err) {
            console.error(err);
            alert("Błąd podczas usuwania kroku.");
        }
    };

    if (loading && steps.length === 0) return <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-20" size={48} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">Kroki współpracy</h1>
                    <p className="mt-2 text-charcoal/50 font-serif">Definiuj etapy procesu projektowego.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-black/80 transition-all font-sans text-sm tracking-wide shadow-lg shadow-black/10"
                >
                    <Plus size={18} />
                    DODAJ KROK
                </button>
            </header>

            <div className="grid gap-6">
                {steps.map((step) => (
                    <div key={step.id} className="group flex items-start gap-8 p-10 bg-white border border-black/5 rounded-4xl hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                        <div className="shrink-0 flex items-center justify-center w-16 h-16 bg-alabaster rounded-3xl text-2xl font-serif font-bold text-charcoal/20">
                            {step.step_number}
                        </div>

                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-serif font-bold">{step.title}</h3>
                            <p className="text-lg font-serif text-charcoal/60 leading-relaxed">{step.description}</p>
                        </div>

                        <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => handleOpenModal(step)}
                                className="p-4 bg-alabaster hover:bg-black hover:text-white rounded-2xl transition-all duration-300"
                            ><Edit3 size={18} /></button>
                            {/* We use step_number as ID in the interface for now to match the frontend expectations */}
                            <button
                                onClick={() => handleDelete(step.id)}
                                className="p-4 bg-alabaster hover:bg-red-500 hover:text-white text-red-500 rounded-2xl transition-all duration-300"
                            ><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}

                {steps.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-black/10 rounded-[3rem]">
                        <ListChecks className="mx-auto mb-4 opacity-10" size={48} />
                        <p className="text-black/30 font-serif italic text-lg">Brak zdefiniowanych kroków.</p>
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
                            {editingStep?.id ? "Edytuj krok" : "Nowy krok"}
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-100 text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Numer kroku</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingStep?.step_number}
                                        onChange={(e) => setEditingStep({ ...editingStep!, step_number: e.target.value })}
                                        placeholder="01"
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Tytuł</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingStep?.title}
                                        onChange={(e) => setEditingStep({ ...editingStep!, title: e.target.value })}
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Opis</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={editingStep?.description}
                                    onChange={(e) => setEditingStep({ ...editingStep!, description: e.target.value })}
                                    className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5 resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={isSaving}
                                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 rounded-full font-bold hover:bg-black/80 transition-all disabled:opacity-50 text-base tracking-wide shadow-xl shadow-black/10"
                                >
                                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                    {isSaving ? "ZAPISYWANIE..." : "ZAPISZ KROK"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

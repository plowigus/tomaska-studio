"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { getSiteContent, updateSiteContent } from "@/app/src/lib/cms";
import { supabase } from "@/app/src/lib/supabase";

export default function ContentEditor() {
    const [content, setContent] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        async function load() {
            try {
                const data = await getSiteContent();
                setContent(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleUpdate = async (section: string, key: string, value: string) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const saveAll = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            const updates = Object.entries(content).flatMap(([section, keys]) =>
                Object.entries(keys).map(([key, value]) => ({ section, key, value }))
            );

            await updateSiteContent(updates as any);
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err: any) {
            console.error("❌ Content save error details:", {
                message: err.message,
                details: err.details,
                hint: err.hint,
                code: err.code,
                fullError: err
            });
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-20" size={48} /></div>;

    return (
        <div className="max-w-4xl space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight">Edycja Treści</h1>
                    <p className="mt-2 text-black/50 font-serif">Zarządzaj tekstami statycznymi na Twojej stronie.</p>
                </div>
                <button
                    onClick={saveAll}
                    disabled={saving}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-black/90 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>
            </header>

            {status === "success" && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <CheckCircle size={20} />
                    <span>Zmiany zostały zapisane pomyślnie!</span>
                </div>
            )}

            {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <AlertCircle size={20} />
                    <span>Wystąpił błąd podczas zapisywania. Upewnij się, że tabele w bazie istnieją.</span>
                </div>
            )}

            <div className="space-y-16">
                {Object.entries(content).map(([section, keys]) => (
                    <section key={section} className="space-y-6">
                        <h2 className="text-xl font-serif font-bold capitalize border-l-4 border-black pl-4">Sekcja: {section}</h2>
                        <div className="grid gap-8">
                            {Object.entries(keys).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-widest text-black/40">{key}</label>
                                    {value.length > 100 ? (
                                        <textarea
                                            value={value}
                                            onChange={(e) => handleUpdate(section, key, e.target.value)}
                                            rows={4}
                                            className="w-full bg-white border border-black/5 rounded-xl p-4 font-serif text-lg outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all resize-none"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleUpdate(section, key, e.target.value)}
                                            className="w-full bg-white border border-black/5 rounded-xl p-4 font-serif text-lg outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all font-bold"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

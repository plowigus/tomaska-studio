"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Loader2, Trash2, Edit3, X, Save, AlertCircle } from "lucide-react";
import { getProjects, upsertProject, deleteProject, type Project } from "@/app/src/lib/cms";
import Image from "next/image";
import { cn } from "@/app/src/lib/utils";
import { UploadButton, UploadDropzone } from "@/app/src/lib/uploadthing";

export default function ProjectManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isUploadingMain, setIsUploadingMain] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);


    // Block scroll when modal is open
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
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project?: Project) => {
        const normalizedGallery = (project?.gallery || []).map(item =>
            typeof item === 'string' ? { url: item, alt: "" } : item
        );

        setEditingProject(project ? {
            ...project,
            gallery: normalizedGallery
        } : {
            title: "",
            category: "",
            description: "",
            year: new Date().getFullYear().toString(),
            image: "",
            seo_alt: "",
            sort_order: projects.length + 1,
            gallery: []
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        setError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        setIsSaving(true);
        setError(null);
        try {
            await upsertProject(editingProject);
            await loadProjects();
            handleCloseModal();
        } catch (err: any) {
            console.error("❌ Project save error details:", {
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
        if (!confirm("Czy na pewno chcesz usunąć ten projekt?")) return;

        try {
            await deleteProject(id);
            await loadProjects();
        } catch (err) {
            console.error(err);
            alert("Błąd podczas usuwania projektu.");
        }
    };

    if (loading && projects.length === 0) return <div className="flex justify-center p-12"><Loader2 className="animate-spin opacity-20" size={48} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">Portfolio</h1>
                    <p className="mt-2 text-charcoal/50 font-serif">Zarządzaj swoimi projektami i ich kolejnością.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-black/80 transition-all font-sans text-sm tracking-wide shadow-lg shadow-black/10"
                >
                    <Plus size={18} />
                    DODAJ PROJEKT
                </button>
            </header>

            {/* Toast Notification */}
            {toast && (
                <div className={cn(
                    "fixed bottom-8 right-8 z-100 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 transition-all duration-500",
                    toast.type === "success" ? "bg-black text-white" : "bg-red-500 text-white"
                )}>
                    {toast.type === "success" ? <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> : <AlertCircle size={18} />}
                    <span className="text-sm font-bold tracking-wide uppercase">{toast.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="group bg-white rounded-4xl overflow-hidden border border-black/5 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                        <div className="relative h-64 overflow-hidden">
                            {project.image ? (
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-alabaster flex items-center justify-center text-charcoal/20">Brak zdjęcia</div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleOpenModal(project)}
                                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                                ><Edit3 size={20} /></button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform shadow-lg"
                                ><Trash2 size={20} /></button>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] tracking-[0.2em] font-bold text-charcoal/30 uppercase">{project.category}</span>
                                <span className="text-xs font-sans text-charcoal/40 font-medium">{project.year}</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold">{project.title}</h3>
                            <p className="text-sm text-charcoal/40 font-serif mt-3 line-clamp-2 leading-relaxed">{project.description}</p>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-black/10 rounded-[3rem]">
                        <p className="text-black/30 font-serif italic text-lg">Brak projektów. Kliknij "DODAJ PROJEKT" aby zacząć.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div
                        data-lenis-prevent
                        className="relative bg-white w-full max-w-4xl rounded-4xl shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
                    >
                        <button onClick={handleCloseModal} className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-serif font-bold mb-8">
                            {editingProject?.id ? "Edytuj projekt" : "Nowy projekt"}
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
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Tytuł</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingProject?.title}
                                        onChange={(e) => setEditingProject({ ...editingProject!, title: e.target.value })}
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Kategoria</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingProject?.category}
                                        onChange={(e) => setEditingProject({ ...editingProject!, category: e.target.value })}
                                        placeholder="np. 01 lub Wnętrza"
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Rok</label>
                                    <input
                                        required
                                        type="text"
                                        value={editingProject?.year}
                                        onChange={(e) => setEditingProject({ ...editingProject!, year: e.target.value })}
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Kolejność</label>
                                    <input
                                        required
                                        type="number"
                                        value={editingProject?.sort_order}
                                        onChange={(e) => setEditingProject({ ...editingProject!, sort_order: parseInt(e.target.value) })}
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Zdjęcie główne</label>

                                {editingProject?.image && (
                                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-black/5 bg-alabaster group">
                                        <Image
                                            src={editingProject.image}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setEditingProject({ ...editingProject!, image: "" })}
                                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            required
                                            type="text"
                                            value={editingProject?.image}
                                            onChange={(e) => setEditingProject({ ...editingProject!, image: e.target.value })}
                                            placeholder="URL zdjęcia lub wgraj plik..."
                                            className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                        />
                                    </div>
                                    <div className="shrink-0 mt-1">
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onUploadBegin={() => setIsUploadingMain(true)}
                                            onClientUploadComplete={(res: any[]) => {
                                                setIsUploadingMain(false);
                                                if (res && res[0]) {
                                                    setEditingProject({ ...editingProject!, image: res[0].url });
                                                    setToast({ message: "Zdjęcie główne wgrane!", type: "success" });
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                setIsUploadingMain(false);
                                                setToast({ message: `Błąd: ${error.message}`, type: "error" });
                                            }}
                                            appearance={{
                                                button: "bg-black text-white rounded-full px-6 py-3 h-auto text-sm font-sans tracking-wide hover:bg-black/80 transition-all shadow-sm",
                                                allowedContent: "hidden"
                                            }}
                                            content={{
                                                button: isUploadingMain ? "ŁADOWANIE..." : (editingProject?.image ? "Zmień" : "Wgraj")
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Tekst alternatywny (SEO Alt)</label>
                                    <input
                                        type="text"
                                        value={editingProject?.seo_alt}
                                        onChange={(e) => setEditingProject({ ...editingProject!, seo_alt: e.target.value })}
                                        placeholder="np. Nowoczesny salon w stylu loftowym - projekt Kalisz"
                                        className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                    <p className="text-[10px] text-black/30 ml-1 italic">Wpływa na pozycjonowanie w Google i dostępność strony.</p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-black/5 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Galeria zdjęć ({editingProject?.gallery?.length || 0})</label>
                                    <UploadButton
                                        endpoint="galleryUploader"
                                        onUploadBegin={() => setIsUploadingGallery(true)}
                                        onClientUploadComplete={(res: any[]) => {
                                            setIsUploadingGallery(false);
                                            if (res) {
                                                const newItems = res.map(f => ({ url: f.url, alt: "" }));
                                                setEditingProject({
                                                    ...editingProject!,
                                                    gallery: [...(editingProject?.gallery || []), ...newItems]
                                                });
                                                setToast({ message: `Dodano ${res.length} zdjęć do galerii!`, type: "success" });
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            setIsUploadingGallery(false);
                                            setToast({ message: `Błąd galerii: ${error.message}`, type: "error" });
                                        }}
                                        appearance={{
                                            button: "bg-black text-white rounded-full px-6 py-3 h-auto text-[10px] font-sans font-bold tracking-[0.2em] uppercase hover:bg-black/80 transition-all shadow-sm",
                                            allowedContent: "hidden"
                                        }}
                                        content={{
                                            button: isUploadingGallery ? "ŁADOWANIE..." : "DODAJ ZDJĘCIA (MULTI)"
                                        }}
                                    />
                                </div>

                                {editingProject?.gallery && editingProject.gallery.length > 0 && (
                                    <div className="space-y-4">
                                        {editingProject.gallery.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex flex-col md:flex-row gap-6 p-6 bg-alabaster rounded-3xl border border-black/5 group"
                                            >
                                                <div className="relative w-full md:w-48 aspect-video rounded-2xl overflow-hidden shadow-sm shrink-0">
                                                    <Image
                                                        src={item.url}
                                                        alt={`Gallery ${idx}`}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newGallery = [...editingProject.gallery!];
                                                            newGallery.splice(idx, 1);
                                                            setEditingProject({ ...editingProject!, gallery: newGallery });
                                                        }}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 ml-1">SEO Alt dla tego zdjęcia</label>
                                                    <textarea
                                                        rows={2}
                                                        value={item.alt}
                                                        onChange={(e) => {
                                                            const newGallery = [...editingProject.gallery!];
                                                            newGallery[idx] = { ...newGallery[idx], alt: e.target.value };
                                                            setEditingProject({ ...editingProject!, gallery: newGallery });
                                                        }}
                                                        placeholder="np. Zbliżenie na detale marmurowego blatu w kuchni"
                                                        className="w-full bg-white rounded-xl p-3 font-serif text-sm outline-none focus:ring-4 focus:ring-black/5 resize-none border border-black/5"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Opis projektu</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={editingProject?.description}
                                    onChange={(e) => setEditingProject({ ...editingProject!, description: e.target.value })}
                                    className="w-full bg-alabaster rounded-2xl p-4 font-serif text-lg outline-none focus:ring-4 focus:ring-black/5 resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={isSaving}
                                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 rounded-full font-bold hover:bg-black/90 transition-all disabled:opacity-50 text-base tracking-wide shadow-xl shadow-black/10"
                                >
                                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                    {isSaving ? "ZAPISYWANIE..." : "ZAPISZ PROJEKT"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

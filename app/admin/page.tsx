"use client";

import { useState, useEffect } from "react";
import { Briefcase, MessageSquare, Type, Loader2, ListChecks } from "lucide-react";
import { getProjects, getTestimonials, getSiteContent, getOfferSteps } from "@/app/src/lib/cms";

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { name: "Projekty", value: "-", icon: Briefcase, color: "text-blue-600" },
        { name: "Sekcje Treści", value: "-", icon: Type, color: "text-purple-600" },
        { name: "Opinie", value: "-", icon: MessageSquare, color: "text-emerald-600" },
        { name: "Kroki współpracy", value: "-", icon: ListChecks, color: "text-amber-600" },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [projects, testimonials, content, offerSteps] = await Promise.all([
                    getProjects(),
                    getTestimonials(),
                    getSiteContent(),
                    getOfferSteps()
                ]);

                // Calculate total content keys (approximate)
                const contentCount = Object.values(content).reduce((acc, section) =>
                    acc + Object.keys(section).length, 0
                );

                setStats([
                    { name: "Projekty", value: projects.length.toString(), icon: Briefcase, color: "text-blue-600" },
                    { name: "Główne Teksty", value: contentCount.toString(), icon: Type, color: "text-purple-600" },
                    { name: "Opinie", value: testimonials.length.toString(), icon: MessageSquare, color: "text-emerald-600" },
                    { name: "Kroki współpracy", value: offerSteps.length.toString(), icon: ListChecks, color: "text-amber-600" },
                ]);
            } catch (err) {
                console.error("Error loading dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-serif font-bold tracking-tight text-charcoal">Dashboard</h1>
                <p className="mt-2 text-charcoal/50 font-serif text-lg">Witaj w panelu zarządzania Tomaska Studio.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-10 rounded-4xl border border-black/5 shadow-2xl shadow-black/5 group hover:shadow-black/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-3xl bg-alabaster group-hover:scale-110 transition-transform duration-500 ease-out">
                                <stat.icon size={28} className={stat.color} />
                            </div>
                            {loading && <Loader2 size={16} className="animate-spin opacity-20" />}
                        </div>
                        <h3 className="text-xs font-bold text-charcoal/30 uppercase tracking-[0.2em]">{stat.name}</h3>
                        <p className="text-4xl font-serif font-bold mt-2 text-charcoal">{stat.value}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

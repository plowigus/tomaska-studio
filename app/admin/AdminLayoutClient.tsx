"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    LogOut,
    Type,
    ListChecks
} from "lucide-react";
import { cn } from "@/app/src/lib/utils";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Treści", href: "/admin/content", icon: Type },
    { name: "Projekty", href: "/admin/projects", icon: Briefcase },
    { name: "Opinie", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Kroki współpracy", href: "/admin/offer", icon: ListChecks },
];

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-alabaster font-sans text-charcoal">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-black/5 bg-white/40 backdrop-blur-xl lg:flex">
                <div className="flex h-24 items-center px-8">
                    <Link href="/admin" className="text-xl font-serif font-bold tracking-tight text-black">
                        TOMASKA STUDIO
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 px-4 py-6">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg group",
                                    isActive
                                        ? "bg-black text-white shadow-lg shadow-black/10"
                                        : "text-black/50 hover:text-black hover:bg-black/5"
                                )}
                            >
                                <Icon size={18} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-black")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-black/5">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-black/80 transition-all shadow-lg shadow-black/5"
                    >
                        <LogOut size={18} />
                        Wyloguj
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-100 bg-white lg:hidden">
                    <div className="flex h-16 items-center justify-between px-8 border-b border-black/5">
                        <span className="text-lg font-serif font-bold">MENU CMS</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="p-8 space-y-4">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 py-4 text-xl font-medium border-b border-black/5",
                                        isActive ? "text-black" : "text-black/40"
                                    )}
                                >
                                    <Icon size={24} />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <div className="pt-8">
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="flex w-full items-center justify-center gap-3 px-4 py-4 text-lg font-bold text-white bg-black rounded-2xl"
                            >
                                <LogOut size={22} />
                                Wyloguj
                            </button>
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 relative bg-alabaster">
                {/* Floating Navbar Mobile */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-alabaster/80 px-8 backdrop-blur-md lg:hidden">
                    <span className="text-lg font-serif font-bold">TOMASKA</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
                            <Menu size={24} />
                        </button>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}

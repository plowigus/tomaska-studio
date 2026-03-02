"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Nieprawidłowy e-mail lub hasło");
            setIsLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-alabaster p-4 font-serif">
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-charcoal">
                    TOMASKA <span className="font-light italic">CMS</span>
                </h1>
                <p className="text-charcoal/40 mt-2">Panel zarządzania dla Tomaska Studio</p>
            </div>

            <div className="w-full max-w-md">
                <div className="shadow-2xl border border-black/5 rounded-[2.5rem] bg-white/70 backdrop-blur-xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs tracking-widest uppercase text-charcoal/60 mb-2 font-sans font-bold">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl bg-alabaster border-black/5 focus:ring-black/5 font-serif text-lg py-3 px-4 outline-none border transition-all"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase text-charcoal/60 mb-2 font-sans font-bold">
                                Hasło
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-xl bg-alabaster border-black/5 focus:ring-black/5 font-serif text-lg py-3 px-4 outline-none border transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-sans">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black hover:bg-black/90 text-white text-sm uppercase tracking-widest font-bold rounded-xl h-12 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                        >
                            {isLoading ? "Logowanie..." : "Zaloguj się"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

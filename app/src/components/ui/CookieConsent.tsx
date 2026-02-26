"use client";

import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "tomaska-cookie-consent";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (consent !== "accepted") {
            // Small delay so banner slides in after page load
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setVisible(false);
        // Dispatch event so GoogleAnalytics component can react
        window.dispatchEvent(new Event("cookie-consent-granted"));
    };

    const handleReject = () => {
        // Don't save anything — banner will show again on next visit
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-9999 max-w-sm w-[calc(100%-3rem)] sm:w-auto animate-in"
            style={{
                animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
        >
            <div className="bg-white border border-black/10 rounded-2xl shadow-2xl p-6">
                <p className="text-sm leading-relaxed text-black/70 font-sans mb-1">
                    <span className="font-semibold text-black block mb-1">Szanujemy Twoją prywatność 🍪</span>
                    Używamy plików cookie, aby analizować ruch na stronie i zapewnić najlepsze doświadczenia.
                </p>
                <div className="flex items-center gap-3 mt-4">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-black text-white text-xs font-semibold tracking-wider uppercase py-3 px-5 rounded-lg hover:bg-black/80 transition-colors cursor-pointer"
                    >
                        Akceptuję
                    </button>
                    <button
                        onClick={handleReject}
                        className="flex-1 bg-transparent text-black text-xs font-semibold tracking-wider uppercase py-3 px-5 rounded-lg border border-black/20 hover:bg-black/5 transition-colors cursor-pointer"
                    >
                        Odrzuć
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

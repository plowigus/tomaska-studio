"use client";

import Script from "next/script";
import { useState, useEffect } from "react";

const GA_ID = "G-WY90FMS31D";
const COOKIE_CONSENT_KEY = "tomaska-cookie-consent";

export function GoogleAnalytics() {
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        if (activated) return;

        // Check if consent was already given
        const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";

        const activateIfReady = () => {
            const consentNow = localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
            if (consentNow) {
                setActivated(true);
                cleanup();
            }
        };

        const interactionEvents: (keyof WindowEventMap)[] = [
            "scroll",
            "click",
            "touchstart",
            "keydown",
            "mousemove",
        ];

        const cleanup = () => {
            interactionEvents.forEach((e) => window.removeEventListener(e, activateIfReady));
            window.removeEventListener("cookie-consent-granted", activateIfReady);
        };

        if (hasConsent) {
            // Consent already given — wait for first interaction only
            interactionEvents.forEach((e) =>
                window.addEventListener(e, activateIfReady, { once: true, passive: true })
            );
        } else {
            // No consent yet — listen for the consent event
            window.addEventListener("cookie-consent-granted", activateIfReady);
        }

        return cleanup;
    }, [activated]);

    if (!activated) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}');
                `}
            </Script>
        </>
    );
}

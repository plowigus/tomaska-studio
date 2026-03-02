"use client";

import { useRef, useState, FormEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, Loader2, CheckCircle, AlertCircle, Paperclip } from "lucide-react";
import { contactSchema, validateFile } from "@/app/src/lib/validations";

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
    content?: Record<string, string>;
}

export function ContactSection({ content }: ContactSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [fileName, setFileName] = useState("");

    const designerName = content?.designer_name || "Joanna Tomaska";
    const phone = content?.phone || "885 469 189";
    const email = content?.email || "wnetrza@tomaskastudio.pl";
    const heading = content?.heading || "Zostańmy w kontakcie!";
    const description = content?.description || "Jesteś zainteresowany projektem wnętrza lub chciałbyś dowiedzieć się jak wygląda współpraca z projektantem? Pisz lub dzwoń śmiało! Odpowiem na wszystkie Twoje pytania.";

    useGSAP(() => {
        gsap.from(headerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        if (contentRef.current) {
            gsap.from(Array.from(contentRef.current.children), {
                y: 40,
                opacity: 0,
                duration: 0.5,
                stagger: 0.15,
                ease: "power2.out",
                clearProps: "all",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }
    }, { scope: containerRef });

    const handleFileChange = () => {
        const file = fileInputRef.current?.files?.[0];
        setFileName(file ? file.name : "");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (status === "sending") return;

        setStatus("sending");
        setErrorMessage("");
        setFieldErrors({});

        const formData = new FormData(formRef.current!);

        // Client-side validation
        const formValues = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        const result = contactSchema.safeParse(formValues);
        let hasError = false;
        const newFieldErrors: Record<string, string> = {};

        if (!result.success && "error" in result) {
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newFieldErrors[err.path[0].toString()] = err.message;
                }
            });
            hasError = true;
        }

        const file = formData.get("attachment") as File | null;
        if (file && file.size > 0) {
            const fileErrorMsg = validateFile(file);
            if (fileErrorMsg) {
                newFieldErrors["attachment"] = fileErrorMsg;
                hasError = true;
            }
        }

        if (hasError) {
            setFieldErrors(newFieldErrors);
            setStatus("error");
            setErrorMessage("Popraw błędy w formularzu.");
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus("error");
                setErrorMessage(data.error || "Wystąpił błąd.");
                return;
            }

            setStatus("success");
            setFieldErrors({});
            formRef.current?.reset();
            setFileName("");

            setTimeout(() => setStatus("idle"), 5000);
        } catch {
            setStatus("error");
            setErrorMessage("Nie udało się wysłać wiadomości. Sprawdź połączenie.");
        }
    };

    const inputClasses = "w-full bg-transparent border border-black/40 focus:border-black py-3 px-4 text-[15px] text-charcoal placeholder:text-black/40 outline-none transition-colors duration-300";
    const labelClasses = "block text-xs tracking-widest uppercase text-charcoal mb-2 font-bold";

    return (
        <section
            ref={containerRef}
            id="kontakt"
            className="px-8 md:px-16 lg:px-24 pt-16 pb-24 md:pt-24 md:pb-32 min-h-dvh lg:h-dvh flex flex-col justify-center bg-alabaster overflow-hidden text-charcoal"
        >
            <div ref={headerRef} className="mb-10 lg:mb-12 border-b border-black/30 pb-6">
                <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] tracking-tight font-bold uppercase font-serif leading-none">
                    Kontakt
                </h2>
            </div>

            <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-[1600px] mx-auto">
                {/* Left: Contact Info */}
                <div className="flex flex-col justify-start">
                    <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8">{heading}</h3>
                    <p className="text-lg md:text-xl leading-relaxed mb-10 font-serif">
                        {description}
                    </p>

                    <div className="space-y-6">
                        <div>
                            <span className="text-xs tracking-widest uppercase block mb-1 font-bold">Projektant</span>
                            <span className="text-xl tracking-wide font-light">{designerName}</span>
                        </div>
                        <div>
                            <span className="text-xs tracking-widest uppercase block mb-1 font-bold">Telefon</span>
                            <a href={`tel:+48${phone.replace(/\s/g, '')}`} className="text-xl tracking-wide font-light hover:text-black/70 transition-colors">
                                {phone}
                            </a>
                        </div>
                        <div>
                            <span className="text-xs tracking-widest uppercase block mb-1 font-bold">E-mail</span>
                            <a href={`mailto:${email}`} className="text-xl tracking-wide font-light hover:text-black/70 transition-colors">
                                {email}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="flex flex-col justify-start">

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        {/* Honeypot */}
                        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                        <div>
                            <label htmlFor="contact-name" className={labelClasses}>Imię i nazwisko</label>
                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                className={inputClasses}
                                placeholder="Jan Kowalski"
                            />
                            {fieldErrors.name && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-email" className={labelClasses}>E-mail</label>
                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                className={inputClasses}
                                placeholder="jan@example.com"
                            />
                            {fieldErrors.email && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-subject" className={labelClasses}>Temat</label>
                            <input
                                id="contact-subject"
                                type="text"
                                name="subject"
                                className={inputClasses}
                                placeholder="Projekt wnętrza mieszkania"
                            />
                            {fieldErrors.subject && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.subject}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-message" className={labelClasses}>Wiadomość</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                rows={3}
                                className={`${inputClasses} resize-none`}
                                placeholder="Opisz swoje oczekiwania..."
                            />
                            {fieldErrors.message && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.message}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClasses}>Załącznik (opcjonalnie, max 5MB)</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="attachment"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip"
                            />
                            {fieldErrors.attachment && (
                                <p className="text-red-600 text-xs mt-1 mb-2">{fieldErrors.attachment}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer flex items-center gap-3 py-3 text-sm text-black/50 hover:text-black transition-colors duration-300"
                            >
                                <Paperclip size={16} />
                                <span>{fileName || "Dodaj plik"}</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="cursor-pointer group relative flex items-center gap-3 px-10 py-4 bg-black text-white text-sm tracking-widest uppercase hover:opacity-85 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === "sending" ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Wysyłanie...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Wyślij wiadomość
                                </>
                            )}
                        </button>

                        {status === "success" && (
                            <div className="flex items-center gap-3 text-green-700 text-sm">
                                <CheckCircle size={18} />
                                <span>Wiadomość wysłana pomyślnie! Odezwę się wkrótce.</span>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-3 text-red-700 text-sm">
                                <AlertCircle size={18} />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

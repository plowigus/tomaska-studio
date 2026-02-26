import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, validateFile } from "@/app/src/lib/validations";

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (entry.count >= RATE_LIMIT) return false;

    entry.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Zbyt wiele wiadomości. Spróbuj ponownie za chwilę." },
                { status: 429 }
            );
        }

        const formData = await request.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;
        const honeypot = formData.get("website") as string; // honeypot field
        const file = formData.get("attachment") as File | null;

        // Honeypot check
        if (honeypot) {
            return NextResponse.json({ success: true }); // Silently succeed for bots
        }

        // Zod Validation
        const result = contactSchema.safeParse({
            name,
            email,
            subject,
            message,
        });

        if (!result.success) {
            // Return the first validation error message
            const firstError = result.error.issues[0]?.message || "Nieprawidłowe dane formularza.";
            return NextResponse.json(
                { error: firstError },
                { status: 400 }
            );
        }

        // Prepare attachment
        const attachments: { filename: string; content: Buffer }[] = [];
        if (file && file.size > 0) {
            const fileError = validateFile(file);
            if (fileError) {
                return NextResponse.json(
                    { error: fileError },
                    { status: 400 }
                );
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({ filename: file.name, content: buffer });
        }

        // Send email
        if (!process.env.RESEND_API_KEY) {
            console.warn("[Contact Form] No RESEND_API_KEY set. Email not sent.");
            console.log("[Contact Form] Would send:", { name, email, subject, message, hasAttachment: attachments.length > 0 });
            return NextResponse.json({ success: true });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "Tomaska Studio Kontakt <onboarding@resend.dev>",
            to: "plowigus@gmail.com",
            replyTo: email,
            subject: `[Nowa Wiadomość] ${subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                        .header { background-color: #000000; color: #ffffff; padding: 30px 40px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
                        .content { padding: 40px; }
                        .pill { display: inline-block; background-color: #f0f0f0; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 20px; }
                        .detail-row { margin-bottom: 25px; }
                        .label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 5px; }
                        .value { font-size: 16px; color: #111; margin: 0; }
                        .message-box { background-color: #fafafa; border-left: 3px solid #000; padding: 20px; margin-top: 30px; }
                        .message-text { font-size: 15px; line-height: 1.6; color: #333; margin: 0; white-space: pre-wrap; }
                        .footer { background-color: #f5f5f5; border-top: 1px solid #eaeaea; padding: 20px; text-align: center; font-size: 12px; color: #999; }
                        .attachment-notice { margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 4px; border: 1px solid #d0e3f0; color: #2c5282; font-size: 14px; font-weight: 500; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Tomaska Studio</h1>
                        </div>
                        <div class="content">
                            <span class="pill">Nowe Zapytanie Kontaktowe</span>
                            
                            <div class="detail-row">
                                <span class="label">Od kogo</span>
                                <p class="value"><strong>${name}</strong> (<a href="mailto:${email}" style="color: #000;">${email}</a>)</p>
                            </div>
                            
                            <div class="detail-row">
                                <span class="label">Temat</span>
                                <p class="value" style="font-weight: 600;">${subject}</p>
                            </div>

                            <div class="message-box">
                                <span class="label">Treść wiadomości</span>
                                <p class="message-text">${message}</p>
                            </div>

                            ${attachments.length > 0 ? `
                                <div class="attachment-notice">
                                    📎 Uwaga: Użytkownik dołączył plik do tej wiadomości. Znajdziesz go w załącznikach e-maila.
                                </div>
                            ` : ''}
                        </div>
                        <div class="footer">
                            Ta wiadomość została wysłana z formularza kontaktowego na stronie tomaskastudio.pl
                        </div>
                    </div>
                </body>
                </html>
            `,
            attachments,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Contact Form] Error:", error);
        return NextResponse.json(
            { error: "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie." },
            { status: 500 }
        );
    }
}

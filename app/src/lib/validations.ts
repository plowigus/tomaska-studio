import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/zip",
    "application/x-zip-compressed",
];

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, "Imię i nazwisko musi mieć minimum 2 znaki.")
        .max(100, "Imię i nazwisko nie może przekraczać 100 znaków."),
    email: z
        .string()
        .email("Proszę podać poprawny adres e-mail."),
    subject: z
        .string()
        .min(3, "Temat wiadomości musi mieć minimum 3 znaki.")
        .max(150, "Temat nie może przekraczać 150 znaków."),
    message: z
        .string()
        .min(10, "Wiadomość musi mieć minimum 10 znaków.")
        .max(2000, "Wiadomość nie może przekraczać 2000 znaków."),
});

// Helper for validating the uploaded file shape, since Files behave differently
// depending on whether they are checked on client or server.
export const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        return "Rozmiar pliku nie może przekraczać 5MB.";
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return "Niedozwolony format pliku. Dozwolone: PDF, JPG, PNG, DOC, ZIP.";
    }
    return null;
};

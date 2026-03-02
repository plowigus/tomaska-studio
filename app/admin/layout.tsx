import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

const ALLOWED_EMAILS = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2
].filter((email): email is string => Boolean(email));

console.log("Allowed emails:", ALLOWED_EMAILS);

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email || !ALLOWED_EMAILS.includes(email)) {
        redirect("/login");
    }

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}

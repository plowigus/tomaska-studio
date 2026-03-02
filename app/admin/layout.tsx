import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

const ALLOWED_EMAILS = [
    "wnetrza@tomaskastudio.pl",
    "plowigus@gmail.com"
];

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

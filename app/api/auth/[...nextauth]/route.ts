import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const users = [
                    { email: process.env.ADMIN_EMAIL_1, password: process.env.ADMIN_PASS_1 },
                    { email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASS_2 }
                ];

                const user = users.find(u =>
                    u.email === credentials.email &&
                    u.password === credentials.password
                );

                if (user && user.email) {
                    return { id: user.email, email: user.email, name: "Admin" };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt" as any,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <DashboardLayoutClient
            user={{
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
            }}
        >
            {children}
        </DashboardLayoutClient>
    );
}

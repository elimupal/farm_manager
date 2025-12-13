"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUserStore } from "@/store/use-user-store";
import { cn } from "@/lib/utils";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
}

export function DashboardLayoutClient({ children, user }: DashboardLayoutClientProps) {
    const { sidebarCollapsed } = useUserStore();

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div
                className={cn(
                    "transition-all duration-300",
                    sidebarCollapsed ? "md:pl-16" : "md:pl-64"
                )}
            >
                <Header user={user} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

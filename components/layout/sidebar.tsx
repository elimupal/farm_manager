"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/use-user-store";
import {
    LayoutDashboard,
    MapPin,
    Sprout,
    Package,
    Users,
    Activity,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Fields", href: "/dashboard/fields", icon: MapPin },
    { name: "Crops & Planting", href: "/dashboard/plantings", icon: Sprout },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package },
    { name: "Employees", href: "/dashboard/employees", icon: Users },
    { name: "Activities", href: "/dashboard/activities", icon: Activity },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar } = useUserStore();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r bg-card",
                sidebarCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
                {!sidebarCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Sprout className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-lg">Farm Manager</span>
                    </Link>
                )}
                {sidebarCollapsed && (
                    <div className="bg-primary/10 p-2 rounded-lg mx-auto">
                        <Sprout className="h-6 w-6 text-primary" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    // Exact match for dashboard, startsWith for other routes
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                            title={sidebarCollapsed ? item.name : undefined}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!sidebarCollapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Toggle Button */}
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-center"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Collapse
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}

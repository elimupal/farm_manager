/**
 * Client side store for user preferences
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
    sidebarCollapsed: boolean;
    theme: "light" | "dark" | "system";
    itemsPerPage: number;
}

interface UserStore extends UserPreferences {
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setTheme: (theme: UserPreferences["theme"]) => void;
    setItemsPerPage: (count: number) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            theme: "light",
            itemsPerPage: 10,
            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            setTheme: (theme) => set({ theme }),
            setItemsPerPage: (count) => set({ itemsPerPage: count }),
        }),
        {
            name: "user-preferences",
        }
    )
);

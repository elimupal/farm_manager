"use server";

import { authService, type RegisterUserData } from "@/lib/services/auth.service";
import { UserRole } from "@/core/domain/constants";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema";

export interface RegisterUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
}

export async function loginAction(email: string, password: string) {
    try {
        console.log("Login attempt:", { email, passwordLength: password?.length });

        // Use AuthService to verify credentials
        const user = await authService.verifyCredentials(email, password);

        if (!user) {
            console.log("Invalid credentials");
            return { success: false, error: "Invalid email or password" };
        }

        console.log("Credentials valid");
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Invalid email or password" };
    }
}

export async function registerAction(data: RegisterFormData) {
    try {
        const validated = registerSchema.parse(data);

        // Use AuthService to create user
        const user = await authService.createUser(validated);

        return { success: true, data: { id: user.id, email: user.email } };
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle specific error types
        if (error.name === "ConflictError") {
            return { success: false, error: error.message };
        }

        if (error.name === "ValidationError") {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Failed to create account" };
    }
}

export async function logoutAction() {
    "use server";
    // Logout needs to be handled client-side with next-auth/react
    // This action just returns success to trigger client-side signOut
    return { success: true };
}

"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema";
import bcrypt from "bcryptjs";

export async function loginAction(email: string, password: string) {
    try {
        console.log("Login attempt:", { email, passwordLength: password?.length });

        // Manually verify credentials first
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log("User not found");
            return { success: false, error: "Invalid email or password" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid password");
            return { success: false, error: "Invalid email or password" };
        }

        console.log("Credentials valid, user authenticated");
        return { success: true, user: { id: user.id, email: user.email, role: user.role } };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Invalid email or password" };
    }
}

export async function registerAction(data: RegisterFormData) {
    try {
        const validated = registerSchema.parse(data);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                firstName: validated.firstName,
                lastName: validated.lastName,
                phone: validated.phone,
                role: validated.role,
            },
        });

        return { success: true, data: { id: user.id, email: user.email } };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Failed to create account" };
    }
}

export async function logoutAction() {
    "use server";
    // Logout needs to be handled client-side with next-auth/react
    // This action just returns success to trigger client-side signOut
    return { success: true };
}

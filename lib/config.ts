// Environment variables are automatically loaded by Next.js and tsx
// No need for dotenv.config() in Next.js projects

export const config = {
    // Database
    database: {
        url: process.env.DATABASE_URL || "",
    },

    // Authentication
    auth: {
        secret: process.env.NEXTAUTH_SECRET || "",
        url: process.env.NEXTAUTH_URL || "http://localhost:3001",
    },

    // Seeding
    seed: {
        defaultPassword: process.env.SEED_DEFAULT_PASSWORD || "password123",
    },
} as const;

export default config;

// Environment variables are automatically loaded by Next.js and Node.js
// No need for dotenv.config() in Next.js projects

const config = {
    // Database
    database: {
        url: process.env.DATABASE_URL || "",
    },

    // Authentication
    auth: {
        secret: process.env.NEXTAUTH_SECRET || "",
        url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    },

    // Seeding
    seed: {
        defaultPassword: process.env.SEED_DEFAULT_PASSWORD || "password123",
    },
};

module.exports = config;

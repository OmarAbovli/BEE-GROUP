import { db } from "./db";
import { users } from "./db/schema";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
    const hashedPassword = await bcrypt.hash("bee2025", 10);

    try {
        await db.insert(users).values({
            username: "admin",
            password: hashedPassword,
            role: "admin"
        }).onConflictDoNothing();
        console.log("Admin user seeded successfully");
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
    process.exit(0);
};

seedAdmin();

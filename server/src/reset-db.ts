import { db } from "./db";
import { sql } from "drizzle-orm";

const resetDb = async () => {
    try {
        await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE;`);
        console.log("Users table dropped.");
    } catch (error) {
        console.error("Error dropping table:", error);
    }
    process.exit(0);
};

resetDb();

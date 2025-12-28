import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

const db_url = process.env.DATABASE_URL;

if (!db_url) {
    console.warn("DATABASE_URL is not defined in environment variables!");
}

const sql = neon(db_url || "");
export const db = drizzle(sql, { schema });

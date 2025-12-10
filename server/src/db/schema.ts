import { pgTable, serial, text, timestamp, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").default("admin"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    name_en: text("name_en"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    title_en: text("title_en"),
    description: text("description"),
    description_en: text("description_en"),
    image_url: text("image_url"),
    category_id: serial("category_id").references(() => categories.id),
    ingredients: text("ingredients"),
    ingredients_en: text("ingredients_en"),
    usage_instructions: text("usage_instructions"),
    usage_instructions_en: text("usage_instructions_en"),
    indications: text("indications"),
    indications_en: text("indications_en"),
    side_effects: text("side_effects"),
    side_effects_en: text("side_effects_en"),
    age_range: text("age_range"),
    age_range_en: text("age_range_en"),
    is_prescription: text("is_prescription").default("false"),
    warning: text("warning"),
    warning_en: text("warning_en"),
    model_path: text("model_path"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    title_en: text("title_en"),
    description: text("description"),
    description_en: text("description_en"),
    date: timestamp("date").defaultNow(),
    cover_image: text("cover_image"),
    gallery_images: text("gallery_images").array(),
    type: text("type").default('social'),
});

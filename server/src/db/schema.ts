import { pgTable, serial, text, timestamp, date, integer } from "drizzle-orm/pg-core";

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
    category_id: integer("category_id").references(() => categories.id),
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

export const jobs = pgTable("jobs", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    title_en: text("title_en"), // English Title
    location: text("location"),
    location_en: text("location_en"), // English Location
    type: text("type").default("Full-time"), // Full-time, Part-time, etc.
    type_en: text("type_en"), // English Type
    description: text("description"),
    description_en: text("description_en"),
    requirements: text("requirements"),
    requirements_en: text("requirements_en"),
    salary_range: text("salary_range"),
    salary_range_en: text("salary_range_en"),
    experience_level: text("experience_level"),
    experience_level_en: text("experience_level_en"),
    work_mode: text("work_mode"),
    work_mode_en: text("work_mode_en"),
    benefits: text("benefits"),
    benefits_en: text("benefits_en"),
    isActive: text("is_active").default("true"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
    id: serial("id").primaryKey(),
    job_id: integer("job_id").references(() => jobs.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    linkedin_url: text("linkedin_url"),
    portfolio_url: text("portfolio_url"),
    experience_years: text("experience_years"),
    expected_salary: text("expected_salary"),
    graduation_year: text("graduation_year"),
    cv_url: text("cv_url"),
    message: text("message"),
    status: text("status").default("pending"), // pending, reviewed, accepted, rejected
    createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject"),
    message: text("message").notNull(),
    status: text("status").default("unread"), // unread, read
    createdAt: timestamp("created_at").defaultNow(),
});

-- Create Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT DEFAULT 'admin',
    "created_at" TIMESTAMP DEFAULT NOW()
);

-- Seed Admin User (Password: bee2025)
-- Note: The password hash below corresponds to 'bee2025'
INSERT INTO "users" ("username", "password", "role")
VALUES ('admin', '$2a$10$YourHashedPasswordHere...', 'admin')
ON CONFLICT ("username") DO NOTHING;

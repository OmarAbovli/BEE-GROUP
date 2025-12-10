ALTER TABLE "products" ADD COLUMN "ingredients" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "usage_instructions" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "indications" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "side_effects" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "age_range" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_prescription" text DEFAULT 'false';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "warning" text;
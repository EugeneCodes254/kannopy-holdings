CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'Other' NOT NULL,
	"image" text DEFAULT '🛍️' NOT NULL,
	"msrp" real NOT NULL,
	"currentPrice" real NOT NULL,
	"lowestFound" real NOT NULL,
	"period" integer DEFAULT 60 NOT NULL,
	"daysElapsed" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'tracking' NOT NULL,
	"fraudRisk" text DEFAULT 'low' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
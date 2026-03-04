CREATE TABLE "rebates" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"msrp" real NOT NULL,
	"paidPrice" real NOT NULL,
	"gross" real NOT NULL,
	"fee" real NOT NULL,
	"net" real NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "rebates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rebates" ADD CONSTRAINT "rebates_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rebates" ADD CONSTRAINT "rebates_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
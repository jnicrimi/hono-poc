CREATE TABLE "books" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

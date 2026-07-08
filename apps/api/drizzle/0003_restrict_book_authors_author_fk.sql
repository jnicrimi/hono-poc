ALTER TABLE "book_authors" DROP CONSTRAINT "book_authors_author_id_authors_id_fk";
--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE restrict ON UPDATE no action;
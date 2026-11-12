import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "committees" DROP CONSTRAINT "committees_committee_photo_id_media_id_fk";
  
  DROP INDEX "committees_committee_photo_idx";
  ALTER TABLE "organs" ADD COLUMN "slug" varchar;
  ALTER TABLE "organs" ADD COLUMN "description" varchar;
  ALTER TABLE "organs" ADD COLUMN "image_id" integer;
  UPDATE "organs"
    SET "slug" = COALESCE(
      NULLIF(TRIM(BOTH '-' FROM regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g')), ''),
      'organ-' || "id"::text
    ),
    "description" = '';
  ALTER TABLE "organs" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "organs" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "organs" ADD CONSTRAINT "organs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "organs_slug_idx" ON "organs" USING btree ("slug");
  CREATE INDEX "organs_image_idx" ON "organs" USING btree ("image_id");
  ALTER TABLE "committees" DROP COLUMN "committee_photo_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "organs" DROP CONSTRAINT "organs_image_id_media_id_fk";
  
  DROP INDEX "organs_slug_idx";
  DROP INDEX "organs_image_idx";
  ALTER TABLE "committees" ADD COLUMN "committee_photo_id" integer;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_committee_photo_id_media_id_fk" FOREIGN KEY ("committee_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "committees_committee_photo_idx" ON "committees" USING btree ("committee_photo_id");
  ALTER TABLE "organs" DROP COLUMN "slug";
  ALTER TABLE "organs" DROP COLUMN "description";
  ALTER TABLE "organs" DROP COLUMN "image_id";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegates" ADD COLUMN "organ_id" integer;
  ALTER TABLE "delegates" ADD COLUMN "committee_id" integer;
  ALTER TABLE "committees" ADD COLUMN "organ_id" integer;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_organ_id_organs_id_fk" FOREIGN KEY ("organ_id") REFERENCES "public"."organs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_organ_id_organs_id_fk" FOREIGN KEY ("organ_id") REFERENCES "public"."organs"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "delegates_organ_idx" ON "delegates" USING btree ("organ_id");
  CREATE INDEX "delegates_committee_idx" ON "delegates" USING btree ("committee_id");
  CREATE INDEX "committees_organ_idx" ON "committees" USING btree ("organ_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegates" DROP CONSTRAINT "delegates_organ_id_organs_id_fk";
  
  ALTER TABLE "delegates" DROP CONSTRAINT "delegates_committee_id_committees_id_fk";
  
  ALTER TABLE "committees" DROP CONSTRAINT "committees_organ_id_organs_id_fk";
  
  DROP INDEX "delegates_organ_idx";
  DROP INDEX "delegates_committee_idx";
  DROP INDEX "committees_organ_idx";
  ALTER TABLE "delegates" DROP COLUMN "organ_id";
  ALTER TABLE "delegates" DROP COLUMN "committee_id";
  ALTER TABLE "committees" DROP COLUMN "organ_id";`)
}

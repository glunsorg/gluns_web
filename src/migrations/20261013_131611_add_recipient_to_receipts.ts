import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "receipts" ADD COLUMN "recipient_id" integer NOT NULL;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "receipts_recipient_idx" ON "receipts" USING btree ("recipient_id");
  ALTER TABLE "receipts" DROP COLUMN "recipient_name";
  ALTER TABLE "receipts" DROP COLUMN "recipient_email";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "receipts" DROP CONSTRAINT "receipts_recipient_id_users_id_fk";
  
  DROP INDEX "receipts_recipient_idx";
  ALTER TABLE "receipts" ADD COLUMN "recipient_name" varchar NOT NULL;
  ALTER TABLE "receipts" ADD COLUMN "recipient_email" varchar;
  ALTER TABLE "receipts" DROP COLUMN "recipient_id";`)
}

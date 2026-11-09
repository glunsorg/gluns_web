import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegate_assignments" ADD COLUMN "position_paper_id" integer;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_position_paper_id_documents_id_fk" FOREIGN KEY ("position_paper_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "delegate_assignments_position_paper_idx" ON "delegate_assignments" USING btree ("position_paper_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegate_assignments" DROP CONSTRAINT "delegate_assignments_position_paper_id_documents_id_fk";
  
  DROP INDEX "delegate_assignments_position_paper_idx";
  ALTER TABLE "delegate_assignments" DROP COLUMN "position_paper_id";`)
}

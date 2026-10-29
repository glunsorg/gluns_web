import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "institutions" DROP COLUMN "institution_type";
  DROP TYPE "public"."enum_institutions_institution_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_institutions_institution_type" AS ENUM('school', 'university', 'organization');
  ALTER TABLE "institutions" ADD COLUMN "institution_type" "enum_institutions_institution_type" NOT NULL;`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_delegates_gender" ADD VALUE 'not-specified';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegates" ALTER COLUMN "gender" SET DATA TYPE text;
  ALTER TABLE "delegates" ALTER COLUMN "gender" SET DEFAULT 'male'::text;
  DROP TYPE "public"."enum_delegates_gender";
  CREATE TYPE "public"."enum_delegates_gender" AS ENUM('male', 'female');
  ALTER TABLE "delegates" ALTER COLUMN "gender" SET DEFAULT 'male'::"public"."enum_delegates_gender";
  ALTER TABLE "delegates" ALTER COLUMN "gender" SET DATA TYPE "public"."enum_delegates_gender" USING "gender"::"public"."enum_delegates_gender";`)
}

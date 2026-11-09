import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegates" ADD COLUMN "institution_name" varchar;
   UPDATE "delegates" AS d
   SET "institution_name" = COALESCE(i."name", u."institution_name")
   FROM "registrations" AS r
   INNER JOIN "users" AS u ON u."id" = r."registered_by_id"
   LEFT JOIN "institutions" AS i ON i."id" = u."institution_id"
   WHERE d."registration_id" = r."id"
     AND d."institution_name" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "delegates" DROP COLUMN "institution_name";`)
}

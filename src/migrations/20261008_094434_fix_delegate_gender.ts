import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_delegates_gender" AS ENUM('male', 'female');
  CREATE TYPE "public"."enum_delegates_delegate_state" AS ENUM('pending', 'confirmed', 'cancelled');
  CREATE TYPE "public"."enum_invoices_invoice_state" AS ENUM('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled', 'void');
  CREATE TYPE "public"."enum_receipts_receipt_state" AS ENUM('issued', 'void');
  CREATE TYPE "public"."enum_payments_payment_state" AS ENUM('pending', 'successful', 'failed', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('local', 'international');
  CREATE TYPE "public"."enum_events_registration_state" AS ENUM('draft', 'open', 'closed');
  CREATE TYPE "public"."enum_registrations_registration_type" AS ENUM('individual', 'institution');
  CREATE TYPE "public"."enum_registrations_registration_state" AS ENUM('draft', 'active', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_delegate_assignments_assignment_state" AS ENUM('pending', 'assigned', 'confirmed');
  CREATE TYPE "public"."enum_trainers_gender" AS ENUM('male', 'female');
  CREATE TYPE "public"."enum_registration_batches_batch_state" AS ENUM('draft', 'pending_payment', 'partially_paid', 'paid', 'cancelled');
  CREATE TYPE "public"."enum_organs_organ_type" AS ENUM('committee_based', 'court', 'commission', 'other');
  CREATE TYPE "public"."enum_institutions_institution_type" AS ENUM('school', 'university', 'organization');
  CREATE TYPE "public"."enum_institution_memberships_role" AS ENUM('student', 'teacher', 'administrator');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_our_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"secretariat_id" integer
  );
  
  CREATE TABLE "invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"invoice_number" varchar NOT NULL,
  	"registration_id" integer NOT NULL,
  	"batch_id" integer,
  	"invoice_state" "enum_invoices_invoice_state" DEFAULT 'draft' NOT NULL,
  	"issue_date" timestamp(3) with time zone NOT NULL,
  	"due_date" timestamp(3) with time zone,
  	"currency" varchar DEFAULT 'KES' NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"discount" numeric DEFAULT 0,
  	"tax" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"amount_paid" numeric DEFAULT 0,
  	"balance_due" numeric NOT NULL,
  	"pdf_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "invoice_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"invoice_id" integer NOT NULL,
  	"description" varchar NOT NULL,
  	"quantity" numeric NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"amount" numeric NOT NULL,
  	"delegate_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "receipts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"receipt_number" varchar NOT NULL,
  	"payment_id" integer NOT NULL,
  	"invoice_id" integer NOT NULL,
  	"registration_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"payment_method" varchar NOT NULL,
  	"transaction_reference" varchar,
  	"recipient_name" varchar NOT NULL,
  	"recipient_email" varchar,
  	"issued_at" timestamp(3) with time zone NOT NULL,
  	"receipt_state" "enum_receipts_receipt_state" DEFAULT 'issued' NOT NULL,
  	"pdf_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" jsonb NOT NULL,
  	"venue" varchar NOT NULL,
  	"cost" numeric,
  	"currency" varchar DEFAULT 'KES',
  	"event_type" "enum_events_event_type" NOT NULL,
  	"registration_state" "enum_events_registration_state" DEFAULT 'draft' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"registration_open" timestamp(3) with time zone NOT NULL,
  	"registration_close" timestamp(3) with time zone NOT NULL,
  	"allow_individual_registration" boolean DEFAULT true,
  	"allow_institution_registration" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registration_number" varchar NOT NULL,
  	"event_id" integer NOT NULL,
  	"registration_type" "enum_registrations_registration_type" NOT NULL,
  	"registered_by_id" integer NOT NULL,
  	"institution_id" integer,
  	"registration_state" "enum_registrations_registration_state" DEFAULT 'draft' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "delegate_assignments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"delegate_id" integer NOT NULL,
  	"country_id" integer NOT NULL,
  	"event_committee_id" integer NOT NULL,
  	"assignment_state" "enum_delegate_assignments_assignment_state" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trainers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"verification_code" varchar,
  	"organ" varchar NOT NULL,
  	"photo_id" integer,
  	"gender" "enum_trainers_gender" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "registration_batches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"batch_number" varchar NOT NULL,
  	"registration_id" integer NOT NULL,
  	"batch_state" "enum_registration_batches_batch_state" DEFAULT 'draft' NOT NULL,
  	"sequence" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"event_id" integer NOT NULL,
  	"committee_id" integer NOT NULL,
  	"available" boolean DEFAULT true,
  	"capacity" numeric,
  	"fee" numeric,
  	"currency" varchar DEFAULT 'KES',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "organs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"organ_type" "enum_organs_organ_type" NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "institutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"institution_type" "enum_institutions_institution_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "institution_memberships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"institution_id" integer NOT NULL,
  	"role" "enum_institution_memberships_role" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "secretariat" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"email" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"active" boolean DEFAULT true NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "delegation_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "delegations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faculty_advisors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "committee_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "committee_team" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "delegation_applications" CASCADE;
  DROP TABLE "delegations" CASCADE;
  DROP TABLE "faculty_advisors" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "_blog_v" CASCADE;
  DROP TABLE "committee_categories" CASCADE;
  DROP TABLE "committee_team" CASCADE;
  ALTER TABLE "delegates" DROP CONSTRAINT "delegates_teacher_id_users_id_fk";
  
  ALTER TABLE "delegates" DROP CONSTRAINT "delegates_delegation_id_delegations_id_fk";
  
  ALTER TABLE "payments" DROP CONSTRAINT "payments_teacher_id_users_id_fk";
  
  ALTER TABLE "payments" DROP CONSTRAINT "payments_delegation_id_delegations_id_fk";
  
  ALTER TABLE "committees" DROP CONSTRAINT "committees_committee_category_id_committee_categories_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_delegation_applications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_delegations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faculty_advisors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_committee_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_committee_team_fk";
  
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('teacher', 'delegate', 'secretariat', 'admin');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP INDEX "delegates_teacher_idx";
  DROP INDEX "delegates_delegation_idx";
  DROP INDEX "payments_teacher_idx";
  DROP INDEX "payments_delegation_idx";
  DROP INDEX "committees_committee_category_idx";
  DROP INDEX "payload_locked_documents_rels_delegation_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_delegations_id_idx";
  DROP INDEX "payload_locked_documents_rels_faculty_advisors_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_id_idx";
  DROP INDEX "payload_locked_documents_rels_committee_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_committee_team_id_idx";
  ALTER TABLE "documents" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "documents" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "delegates" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "delegates" ALTER COLUMN "grade_level" SET DATA TYPE varchar;
  ALTER TABLE "delegates" ALTER COLUMN "grade_level" SET DEFAULT 'Grade 12';
  ALTER TABLE "users" ADD COLUMN "full_name" varchar DEFAULT 'Unknown' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "documents" ADD COLUMN "prefix" varchar DEFAULT 'documents';
  ALTER TABLE "portraits" ADD COLUMN "prefix" varchar DEFAULT 'portraits';
  ALTER TABLE "delegates" ADD COLUMN "full_name" varchar NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "phone" varchar;
  ALTER TABLE "delegates" ADD COLUMN "gender" "enum_delegates_gender" DEFAULT 'male' NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "registration_id" integer NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "batch_id" integer NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "institution_id" integer;
  ALTER TABLE "delegates" ADD COLUMN "delegate_state" "enum_delegates_delegate_state" DEFAULT 'pending' NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "payment_number" varchar NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "registration_id" integer NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "invoice_id" integer NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "currency" varchar NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "transaction_reference" varchar;
  ALTER TABLE "payments" ADD COLUMN "payment_state" "enum_payments_payment_state" DEFAULT 'pending' NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "initiated_at" timestamp(3) with time zone;
  ALTER TABLE "payments" ADD COLUMN "paid_at" timestamp(3) with time zone;
  ALTER TABLE "payments" ADD COLUMN "provider_response" jsonb;
  ALTER TABLE "committees" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "committees" ADD COLUMN "organ_id" integer NOT NULL;
  ALTER TABLE "committees" ADD COLUMN "active" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invoices_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invoice_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "receipts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "registrations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "delegate_assignments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sponsors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "trainers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "registration_batches_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "event_committees_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "organs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "institutions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "institution_memberships_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "secretariat_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "countries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_our_team" ADD CONSTRAINT "pages_blocks_our_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_secretariat_fk" FOREIGN KEY ("secretariat_id") REFERENCES "public"."secretariat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_batch_id_registration_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."registration_batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_delegate_id_delegates_id_fk" FOREIGN KEY ("delegate_id") REFERENCES "public"."delegates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_registered_by_id_users_id_fk" FOREIGN KEY ("registered_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_delegate_id_delegates_id_fk" FOREIGN KEY ("delegate_id") REFERENCES "public"."delegates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_event_committee_id_event_committees_id_fk" FOREIGN KEY ("event_committee_id") REFERENCES "public"."event_committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trainers" ADD CONSTRAINT "trainers_photo_id_portraits_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."portraits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registration_batches" ADD CONSTRAINT "registration_batches_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_committees" ADD CONSTRAINT "event_committees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_committees" ADD CONSTRAINT "event_committees_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institution_memberships" ADD CONSTRAINT "institution_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institution_memberships" ADD CONSTRAINT "institution_memberships_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "secretariat" ADD CONSTRAINT "secretariat_photo_id_portraits_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."portraits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_our_team_order_idx" ON "pages_blocks_our_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_our_team_parent_id_idx" ON "pages_blocks_our_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_our_team_path_idx" ON "pages_blocks_our_team" USING btree ("_path");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_secretariat_id_idx" ON "pages_rels" USING btree ("secretariat_id");
  CREATE UNIQUE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");
  CREATE INDEX "invoices_registration_idx" ON "invoices" USING btree ("registration_id");
  CREATE INDEX "invoices_batch_idx" ON "invoices" USING btree ("batch_id");
  CREATE INDEX "invoices_pdf_idx" ON "invoices" USING btree ("pdf_id");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  CREATE UNIQUE INDEX "invoiceNumber_idx" ON "invoices" USING btree ("invoice_number");
  CREATE INDEX "registration_1_idx" ON "invoices" USING btree ("registration_id");
  CREATE INDEX "invoiceState_idx" ON "invoices" USING btree ("invoice_state");
  CREATE INDEX "invoice_items_invoice_idx" ON "invoice_items" USING btree ("invoice_id");
  CREATE INDEX "invoice_items_delegate_idx" ON "invoice_items" USING btree ("delegate_id");
  CREATE INDEX "invoice_items_updated_at_idx" ON "invoice_items" USING btree ("updated_at");
  CREATE INDEX "invoice_items_created_at_idx" ON "invoice_items" USING btree ("created_at");
  CREATE INDEX "invoice_idx" ON "invoice_items" USING btree ("invoice_id");
  CREATE UNIQUE INDEX "receipts_receipt_number_idx" ON "receipts" USING btree ("receipt_number");
  CREATE UNIQUE INDEX "receipts_payment_idx" ON "receipts" USING btree ("payment_id");
  CREATE INDEX "receipts_invoice_idx" ON "receipts" USING btree ("invoice_id");
  CREATE INDEX "receipts_registration_idx" ON "receipts" USING btree ("registration_id");
  CREATE INDEX "receipts_pdf_idx" ON "receipts" USING btree ("pdf_id");
  CREATE INDEX "receipts_updated_at_idx" ON "receipts" USING btree ("updated_at");
  CREATE INDEX "receipts_created_at_idx" ON "receipts" USING btree ("created_at");
  CREATE UNIQUE INDEX "receiptNumber_idx" ON "receipts" USING btree ("receipt_number");
  CREATE UNIQUE INDEX "payment_idx" ON "receipts" USING btree ("payment_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "registrations_registration_number_idx" ON "registrations" USING btree ("registration_number");
  CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");
  CREATE INDEX "registrations_registered_by_idx" ON "registrations" USING btree ("registered_by_id");
  CREATE INDEX "registrations_institution_idx" ON "registrations" USING btree ("institution_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE INDEX "registrationNumber_idx" ON "registrations" USING btree ("registration_number");
  CREATE UNIQUE INDEX "event_registeredBy_idx" ON "registrations" USING btree ("event_id","registered_by_id");
  CREATE INDEX "event_institution_idx" ON "registrations" USING btree ("event_id","institution_id");
  CREATE UNIQUE INDEX "delegate_assignments_delegate_idx" ON "delegate_assignments" USING btree ("delegate_id");
  CREATE INDEX "delegate_assignments_country_idx" ON "delegate_assignments" USING btree ("country_id");
  CREATE INDEX "delegate_assignments_event_committee_idx" ON "delegate_assignments" USING btree ("event_committee_id");
  CREATE INDEX "delegate_assignments_updated_at_idx" ON "delegate_assignments" USING btree ("updated_at");
  CREATE INDEX "delegate_assignments_created_at_idx" ON "delegate_assignments" USING btree ("created_at");
  CREATE UNIQUE INDEX "delegate_idx" ON "delegate_assignments" USING btree ("delegate_id");
  CREATE INDEX "sponsors_logo_idx" ON "sponsors" USING btree ("logo_id");
  CREATE INDEX "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE UNIQUE INDEX "trainers_verification_code_idx" ON "trainers" USING btree ("verification_code");
  CREATE INDEX "trainers_photo_idx" ON "trainers" USING btree ("photo_id");
  CREATE INDEX "trainers_updated_at_idx" ON "trainers" USING btree ("updated_at");
  CREATE INDEX "trainers_created_at_idx" ON "trainers" USING btree ("created_at");
  CREATE UNIQUE INDEX "registration_batches_batch_number_idx" ON "registration_batches" USING btree ("batch_number");
  CREATE INDEX "registration_batches_registration_idx" ON "registration_batches" USING btree ("registration_id");
  CREATE INDEX "registration_batches_updated_at_idx" ON "registration_batches" USING btree ("updated_at");
  CREATE INDEX "registration_batches_created_at_idx" ON "registration_batches" USING btree ("created_at");
  CREATE UNIQUE INDEX "registration_sequence_idx" ON "registration_batches" USING btree ("registration_id","sequence");
  CREATE INDEX "event_committees_event_idx" ON "event_committees" USING btree ("event_id");
  CREATE INDEX "event_committees_committee_idx" ON "event_committees" USING btree ("committee_id");
  CREATE INDEX "event_committees_updated_at_idx" ON "event_committees" USING btree ("updated_at");
  CREATE INDEX "event_committees_created_at_idx" ON "event_committees" USING btree ("created_at");
  CREATE UNIQUE INDEX "event_committee_idx" ON "event_committees" USING btree ("event_id","committee_id");
  CREATE INDEX "organs_updated_at_idx" ON "organs" USING btree ("updated_at");
  CREATE INDEX "organs_created_at_idx" ON "organs" USING btree ("created_at");
  CREATE UNIQUE INDEX "code_idx" ON "organs" USING btree ("code");
  CREATE INDEX "institutions_updated_at_idx" ON "institutions" USING btree ("updated_at");
  CREATE INDEX "institutions_created_at_idx" ON "institutions" USING btree ("created_at");
  CREATE UNIQUE INDEX "name_idx" ON "institutions" USING btree ("name");
  CREATE INDEX "institution_memberships_user_idx" ON "institution_memberships" USING btree ("user_id");
  CREATE INDEX "institution_memberships_institution_idx" ON "institution_memberships" USING btree ("institution_id");
  CREATE INDEX "institution_memberships_updated_at_idx" ON "institution_memberships" USING btree ("updated_at");
  CREATE INDEX "institution_memberships_created_at_idx" ON "institution_memberships" USING btree ("created_at");
  CREATE INDEX "secretariat_photo_idx" ON "secretariat" USING btree ("photo_id");
  CREATE INDEX "secretariat_updated_at_idx" ON "secretariat" USING btree ("updated_at");
  CREATE INDEX "secretariat_created_at_idx" ON "secretariat" USING btree ("created_at");
  CREATE UNIQUE INDEX "countries_name_idx" ON "countries" USING btree ("name");
  CREATE UNIQUE INDEX "countries_code_idx" ON "countries" USING btree ("code");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE UNIQUE INDEX "code_1_idx" ON "countries" USING btree ("code");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_batch_id_registration_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."registration_batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_organ_id_organs_id_fk" FOREIGN KEY ("organ_id") REFERENCES "public"."organs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoice_items_fk" FOREIGN KEY ("invoice_items_id") REFERENCES "public"."invoice_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_receipts_fk" FOREIGN KEY ("receipts_id") REFERENCES "public"."receipts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegate_assignments_fk" FOREIGN KEY ("delegate_assignments_id") REFERENCES "public"."delegate_assignments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainers_fk" FOREIGN KEY ("trainers_id") REFERENCES "public"."trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registration_batches_fk" FOREIGN KEY ("registration_batches_id") REFERENCES "public"."registration_batches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_committees_fk" FOREIGN KEY ("event_committees_id") REFERENCES "public"."event_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organs_fk" FOREIGN KEY ("organs_id") REFERENCES "public"."organs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institutions_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institution_memberships_fk" FOREIGN KEY ("institution_memberships_id") REFERENCES "public"."institution_memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_secretariat_fk" FOREIGN KEY ("secretariat_id") REFERENCES "public"."secretariat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "delegates_registration_idx" ON "delegates" USING btree ("registration_id");
  CREATE INDEX "delegates_batch_idx" ON "delegates" USING btree ("batch_id");
  CREATE INDEX "delegates_institution_idx" ON "delegates" USING btree ("institution_id");
  CREATE INDEX "registration_idx" ON "delegates" USING btree ("registration_id");
  CREATE INDEX "batch_idx" ON "delegates" USING btree ("batch_id");
  CREATE UNIQUE INDEX "payments_payment_number_idx" ON "payments" USING btree ("payment_number");
  CREATE INDEX "payments_registration_idx" ON "payments" USING btree ("registration_id");
  CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");
  CREATE UNIQUE INDEX "payments_transaction_reference_idx" ON "payments" USING btree ("transaction_reference");
  CREATE UNIQUE INDEX "paymentNumber_idx" ON "payments" USING btree ("payment_number");
  CREATE UNIQUE INDEX "transactionReference_idx" ON "payments" USING btree ("transaction_reference");
  CREATE INDEX "invoice_1_idx" ON "payments" USING btree ("invoice_id");
  CREATE INDEX "committees_organ_idx" ON "committees" USING btree ("organ_id");
  CREATE UNIQUE INDEX "organ_committee_code_idx" ON "committees" USING btree ("organ_id","committee_code");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_invoice_items_id_idx" ON "payload_locked_documents_rels" USING btree ("invoice_items_id");
  CREATE INDEX "payload_locked_documents_rels_receipts_id_idx" ON "payload_locked_documents_rels" USING btree ("receipts_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");
  CREATE INDEX "payload_locked_documents_rels_delegate_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("delegate_assignments_id");
  CREATE INDEX "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX "payload_locked_documents_rels_trainers_id_idx" ON "payload_locked_documents_rels" USING btree ("trainers_id");
  CREATE INDEX "payload_locked_documents_rels_registration_batches_id_idx" ON "payload_locked_documents_rels" USING btree ("registration_batches_id");
  CREATE INDEX "payload_locked_documents_rels_event_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("event_committees_id");
  CREATE INDEX "payload_locked_documents_rels_organs_id_idx" ON "payload_locked_documents_rels" USING btree ("organs_id");
  CREATE INDEX "payload_locked_documents_rels_institutions_id_idx" ON "payload_locked_documents_rels" USING btree ("institutions_id");
  CREATE INDEX "payload_locked_documents_rels_institution_memberships_id_idx" ON "payload_locked_documents_rels" USING btree ("institution_memberships_id");
  CREATE INDEX "payload_locked_documents_rels_secretariat_id_idx" ON "payload_locked_documents_rels" USING btree ("secretariat_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  ALTER TABLE "users" DROP COLUMN "roles";
  ALTER TABLE "users" DROP COLUMN "delegation_name";
  ALTER TABLE "delegates" DROP COLUMN "teacher_id";
  ALTER TABLE "delegates" DROP COLUMN "delegation_id";
  ALTER TABLE "delegates" DROP COLUMN "first_name";
  ALTER TABLE "delegates" DROP COLUMN "last_name";
  ALTER TABLE "delegates" DROP COLUMN "phone_number";
  ALTER TABLE "payments" DROP COLUMN "teacher_id";
  ALTER TABLE "payments" DROP COLUMN "delegation_id";
  ALTER TABLE "payments" DROP COLUMN "delegate_slots_purchased";
  ALTER TABLE "payments" DROP COLUMN "status";
  ALTER TABLE "payments" DROP COLUMN "reference";
  ALTER TABLE "committees" DROP COLUMN "title";
  ALTER TABLE "committees" DROP COLUMN "committee_category_id";
  ALTER TABLE "committees" DROP COLUMN "summary";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "delegation_applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "delegations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faculty_advisors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "committee_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "committee_team_id";
  DROP TYPE "public"."enum_delegation_applications_prefers_double_delegations";
  DROP TYPE "public"."enum_delegation_applications_committee_interests";
  DROP TYPE "public"."enum_delegation_applications_status";
  DROP TYPE "public"."enum_delegates_grade_level";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_blog_status";
  DROP TYPE "public"."enum__blog_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_delegation_applications_prefers_double_delegations" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_delegation_applications_committee_interests" AS ENUM('advanced', 'press', 'novice', 'spanish');
  CREATE TYPE "public"."enum_delegation_applications_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_delegates_grade_level" AS ENUM('Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'paid', 'failed');
  CREATE TYPE "public"."enum_blog_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "delegation_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"delegation_name" varchar NOT NULL,
  	"country_of_origin" varchar NOT NULL,
  	"number_of_delegates" numeric NOT NULL,
  	"number_of_faculty_advisors" numeric NOT NULL,
  	"previous_experience" varchar NOT NULL,
  	"hmun_experience" varchar NOT NULL,
  	"preferred_regions" varchar,
  	"prefers_double_delegations" "enum_delegation_applications_prefers_double_delegations" NOT NULL,
  	"crisis_committee_requests" varchar,
  	"committee_interests" "enum_delegation_applications_committee_interests" NOT NULL,
  	"status" "enum_delegation_applications_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "delegations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"teacher_id" integer NOT NULL,
  	"application_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"max_delegates" numeric NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faculty_advisors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"teacher_id" integer,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"snippet" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blog_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_snippet" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "committee_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "committee_team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"rank" numeric NOT NULL,
  	"photo_id" integer,
  	"committee_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_our_team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invoices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invoice_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "receipts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registrations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "delegate_assignments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trainers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "registration_batches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "event_committees" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "organs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "institutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "institution_memberships" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "secretariat" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "pages_blocks_our_team" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "invoice_items" CASCADE;
  DROP TABLE "receipts" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "delegate_assignments" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "trainers" CASCADE;
  DROP TABLE "registration_batches" CASCADE;
  DROP TABLE "event_committees" CASCADE;
  DROP TABLE "organs" CASCADE;
  DROP TABLE "institutions" CASCADE;
  DROP TABLE "institution_memberships" CASCADE;
  DROP TABLE "secretariat" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  ALTER TABLE "delegates" DROP CONSTRAINT "delegates_registration_id_registrations_id_fk";
  
  ALTER TABLE "delegates" DROP CONSTRAINT "delegates_batch_id_registration_batches_id_fk";
  
  ALTER TABLE "delegates" DROP CONSTRAINT "delegates_institution_id_institutions_id_fk";
  
  ALTER TABLE "payments" DROP CONSTRAINT "payments_registration_id_registrations_id_fk";
  
  ALTER TABLE "payments" DROP CONSTRAINT "payments_invoice_id_invoices_id_fk";
  
  ALTER TABLE "committees" DROP CONSTRAINT "committees_organ_id_organs_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invoices_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invoice_items_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_receipts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_registrations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_delegate_assignments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sponsors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_trainers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_registration_batches_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_event_committees_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_organs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_institutions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_institution_memberships_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_secretariat_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_countries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  ALTER TABLE "users" ALTER COLUMN "roles" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT 'teacher'::text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'secretariat', 'editor', 'teacher');
  ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT 'teacher'::"public"."enum_users_roles";
  ALTER TABLE "users" ALTER COLUMN "roles" SET DATA TYPE "public"."enum_users_roles" USING "roles"::"public"."enum_users_roles";
  DROP INDEX "delegates_registration_idx";
  DROP INDEX "delegates_batch_idx";
  DROP INDEX "delegates_institution_idx";
  DROP INDEX "registration_idx";
  DROP INDEX "batch_idx";
  DROP INDEX "payments_payment_number_idx";
  DROP INDEX "payments_registration_idx";
  DROP INDEX "payments_invoice_idx";
  DROP INDEX "payments_transaction_reference_idx";
  DROP INDEX "paymentNumber_idx";
  DROP INDEX "transactionReference_idx";
  DROP INDEX "invoice_1_idx";
  DROP INDEX "committees_organ_idx";
  DROP INDEX "organ_committee_code_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_invoices_id_idx";
  DROP INDEX "payload_locked_documents_rels_invoice_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_receipts_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_registrations_id_idx";
  DROP INDEX "payload_locked_documents_rels_delegate_assignments_id_idx";
  DROP INDEX "payload_locked_documents_rels_sponsors_id_idx";
  DROP INDEX "payload_locked_documents_rels_trainers_id_idx";
  DROP INDEX "payload_locked_documents_rels_registration_batches_id_idx";
  DROP INDEX "payload_locked_documents_rels_event_committees_id_idx";
  DROP INDEX "payload_locked_documents_rels_organs_id_idx";
  DROP INDEX "payload_locked_documents_rels_institutions_id_idx";
  DROP INDEX "payload_locked_documents_rels_institution_memberships_id_idx";
  DROP INDEX "payload_locked_documents_rels_secretariat_id_idx";
  DROP INDEX "payload_locked_documents_rels_countries_id_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "documents" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "documents" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "delegates" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "delegates" ALTER COLUMN "grade_level" SET DATA TYPE "public"."enum_delegates_grade_level" USING "grade_level"::"public"."enum_delegates_grade_level";
  ALTER TABLE "delegates" ALTER COLUMN "grade_level" DROP DEFAULT;
  ALTER TABLE "users" ADD COLUMN "roles" "enum_users_roles" DEFAULT 'teacher' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "delegation_name" varchar;
  ALTER TABLE "delegates" ADD COLUMN "teacher_id" integer NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "delegation_id" integer NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "first_name" varchar NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "last_name" varchar NOT NULL;
  ALTER TABLE "delegates" ADD COLUMN "phone_number" numeric NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "teacher_id" integer NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "delegation_id" integer NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "delegate_slots_purchased" numeric NOT NULL;
  ALTER TABLE "payments" ADD COLUMN "status" "enum_payments_status" DEFAULT 'pending';
  ALTER TABLE "payments" ADD COLUMN "reference" varchar;
  ALTER TABLE "committees" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "committees" ADD COLUMN "committee_category_id" integer NOT NULL;
  ALTER TABLE "committees" ADD COLUMN "summary" jsonb NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "delegation_applications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "delegations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faculty_advisors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "committee_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "committee_team_id" integer;
  ALTER TABLE "delegation_applications" ADD CONSTRAINT "delegation_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegations" ADD CONSTRAINT "delegations_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegations" ADD CONSTRAINT "delegations_application_id_delegation_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."delegation_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculty_advisors" ADD CONSTRAINT "faculty_advisors_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_parent_id_blog_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committee_team" ADD CONSTRAINT "committee_team_photo_id_portraits_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."portraits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committee_team" ADD CONSTRAINT "committee_team_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "delegation_applications_user_idx" ON "delegation_applications" USING btree ("user_id");
  CREATE INDEX "delegation_applications_updated_at_idx" ON "delegation_applications" USING btree ("updated_at");
  CREATE INDEX "delegation_applications_created_at_idx" ON "delegation_applications" USING btree ("created_at");
  CREATE INDEX "delegations_teacher_idx" ON "delegations" USING btree ("teacher_id");
  CREATE UNIQUE INDEX "delegations_application_idx" ON "delegations" USING btree ("application_id");
  CREATE INDEX "delegations_updated_at_idx" ON "delegations" USING btree ("updated_at");
  CREATE INDEX "delegations_created_at_idx" ON "delegations" USING btree ("created_at");
  CREATE INDEX "faculty_advisors_teacher_idx" ON "faculty_advisors" USING btree ("teacher_id");
  CREATE UNIQUE INDEX "faculty_advisors_email_idx" ON "faculty_advisors" USING btree ("email");
  CREATE UNIQUE INDEX "faculty_advisors_phone_number_idx" ON "faculty_advisors" USING btree ("phone_number");
  CREATE INDEX "faculty_advisors_updated_at_idx" ON "faculty_advisors" USING btree ("updated_at");
  CREATE INDEX "faculty_advisors_created_at_idx" ON "faculty_advisors" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX "blog_cover_image_idx" ON "blog" USING btree ("cover_image_id");
  CREATE INDEX "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX "blog__status_idx" ON "blog" USING btree ("_status");
  CREATE INDEX "_blog_v_parent_idx" ON "_blog_v" USING btree ("parent_id");
  CREATE INDEX "_blog_v_version_version_slug_idx" ON "_blog_v" USING btree ("version_slug");
  CREATE INDEX "_blog_v_version_version_cover_image_idx" ON "_blog_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_blog_v_version_version_updated_at_idx" ON "_blog_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_v_version_version_created_at_idx" ON "_blog_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_v_version_version__status_idx" ON "_blog_v" USING btree ("version__status");
  CREATE INDEX "_blog_v_created_at_idx" ON "_blog_v" USING btree ("created_at");
  CREATE INDEX "_blog_v_updated_at_idx" ON "_blog_v" USING btree ("updated_at");
  CREATE INDEX "_blog_v_latest_idx" ON "_blog_v" USING btree ("latest");
  CREATE INDEX "committee_categories_updated_at_idx" ON "committee_categories" USING btree ("updated_at");
  CREATE INDEX "committee_categories_created_at_idx" ON "committee_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "committee_team_rank_idx" ON "committee_team" USING btree ("rank");
  CREATE INDEX "committee_team_photo_idx" ON "committee_team" USING btree ("photo_id");
  CREATE INDEX "committee_team_committee_idx" ON "committee_team" USING btree ("committee_id");
  CREATE INDEX "committee_team_updated_at_idx" ON "committee_team" USING btree ("updated_at");
  CREATE INDEX "committee_team_created_at_idx" ON "committee_team" USING btree ("created_at");
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_delegation_id_delegations_id_fk" FOREIGN KEY ("delegation_id") REFERENCES "public"."delegations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_delegation_id_delegations_id_fk" FOREIGN KEY ("delegation_id") REFERENCES "public"."delegations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_committee_category_id_committee_categories_id_fk" FOREIGN KEY ("committee_category_id") REFERENCES "public"."committee_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegation_applications_fk" FOREIGN KEY ("delegation_applications_id") REFERENCES "public"."delegation_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegations_fk" FOREIGN KEY ("delegations_id") REFERENCES "public"."delegations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faculty_advisors_fk" FOREIGN KEY ("faculty_advisors_id") REFERENCES "public"."faculty_advisors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committee_categories_fk" FOREIGN KEY ("committee_categories_id") REFERENCES "public"."committee_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committee_team_fk" FOREIGN KEY ("committee_team_id") REFERENCES "public"."committee_team"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "delegates_teacher_idx" ON "delegates" USING btree ("teacher_id");
  CREATE INDEX "delegates_delegation_idx" ON "delegates" USING btree ("delegation_id");
  CREATE INDEX "payments_teacher_idx" ON "payments" USING btree ("teacher_id");
  CREATE INDEX "payments_delegation_idx" ON "payments" USING btree ("delegation_id");
  CREATE INDEX "committees_committee_category_idx" ON "committees" USING btree ("committee_category_id");
  CREATE INDEX "payload_locked_documents_rels_delegation_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("delegation_applications_id");
  CREATE INDEX "payload_locked_documents_rels_delegations_id_idx" ON "payload_locked_documents_rels" USING btree ("delegations_id");
  CREATE INDEX "payload_locked_documents_rels_faculty_advisors_id_idx" ON "payload_locked_documents_rels" USING btree ("faculty_advisors_id");
  CREATE INDEX "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX "payload_locked_documents_rels_committee_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("committee_categories_id");
  CREATE INDEX "payload_locked_documents_rels_committee_team_id_idx" ON "payload_locked_documents_rels" USING btree ("committee_team_id");
  ALTER TABLE "users" DROP COLUMN "full_name";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "documents" DROP COLUMN "prefix";
  ALTER TABLE "portraits" DROP COLUMN "prefix";
  ALTER TABLE "delegates" DROP COLUMN "full_name";
  ALTER TABLE "delegates" DROP COLUMN "phone";
  ALTER TABLE "delegates" DROP COLUMN "gender";
  ALTER TABLE "delegates" DROP COLUMN "registration_id";
  ALTER TABLE "delegates" DROP COLUMN "batch_id";
  ALTER TABLE "delegates" DROP COLUMN "institution_id";
  ALTER TABLE "delegates" DROP COLUMN "delegate_state";
  ALTER TABLE "payments" DROP COLUMN "payment_number";
  ALTER TABLE "payments" DROP COLUMN "registration_id";
  ALTER TABLE "payments" DROP COLUMN "invoice_id";
  ALTER TABLE "payments" DROP COLUMN "currency";
  ALTER TABLE "payments" DROP COLUMN "transaction_reference";
  ALTER TABLE "payments" DROP COLUMN "payment_state";
  ALTER TABLE "payments" DROP COLUMN "initiated_at";
  ALTER TABLE "payments" DROP COLUMN "paid_at";
  ALTER TABLE "payments" DROP COLUMN "provider_response";
  ALTER TABLE "committees" DROP COLUMN "name";
  ALTER TABLE "committees" DROP COLUMN "organ_id";
  ALTER TABLE "committees" DROP COLUMN "active";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invoices_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invoice_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "receipts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "registrations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "delegate_assignments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sponsors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "trainers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "registration_batches_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "event_committees_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "organs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "institutions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "institution_memberships_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "secretariat_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "countries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  DROP TYPE "public"."enum_delegates_gender";
  DROP TYPE "public"."enum_delegates_delegate_state";
  DROP TYPE "public"."enum_invoices_invoice_state";
  DROP TYPE "public"."enum_receipts_receipt_state";
  DROP TYPE "public"."enum_payments_payment_state";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_registration_state";
  DROP TYPE "public"."enum_registrations_registration_type";
  DROP TYPE "public"."enum_registrations_registration_state";
  DROP TYPE "public"."enum_delegate_assignments_assignment_state";
  DROP TYPE "public"."enum_trainers_gender";
  DROP TYPE "public"."enum_registration_batches_batch_state";
  DROP TYPE "public"."enum_organs_organ_type";
  DROP TYPE "public"."enum_institutions_institution_type";
  DROP TYPE "public"."enum_institution_memberships_role";
  DROP TYPE "public"."enum_forms_confirmation_type";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('teacher', 'delegate', 'secretariat', 'admin');
  CREATE TYPE "public"."enum_delegates_gender" AS ENUM('male', 'female', 'not-specified');
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
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar DEFAULT 'Unknown' NOT NULL,
  	"institution_id" integer,
  	"institution_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
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
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'documents',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "portraits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'portraits',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "delegates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"gender" "enum_delegates_gender" DEFAULT 'male' NOT NULL,
  	"grade_level" varchar DEFAULT 'Grade 12' NOT NULL,
  	"registration_id" integer NOT NULL,
  	"batch_id" integer NOT NULL,
  	"institution_id" integer,
  	"delegate_state" "enum_delegates_delegate_state" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"recipient_id" integer NOT NULL,
  	"issued_at" timestamp(3) with time zone NOT NULL,
  	"receipt_state" "enum_receipts_receipt_state" DEFAULT 'issued' NOT NULL,
  	"pdf_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"payment_number" varchar NOT NULL,
  	"registration_id" integer NOT NULL,
  	"invoice_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"transaction_reference" varchar,
  	"payment_state" "enum_payments_payment_state" DEFAULT 'pending' NOT NULL,
  	"initiated_at" timestamp(3) with time zone,
  	"paid_at" timestamp(3) with time zone,
  	"provider_response" jsonb,
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
  
  CREATE TABLE "committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"committee_photo_id" integer,
  	"slug" varchar,
  	"committee_code" varchar NOT NULL,
  	"summary" varchar,
  	"active" boolean DEFAULT true,
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
  	"normalized_name" varchar NOT NULL,
  	"institution_type" "enum_institutions_institution_type" NOT NULL,
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
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"documents_id" integer,
  	"portraits_id" integer,
  	"delegates_id" integer,
  	"invoices_id" integer,
  	"invoice_items_id" integer,
  	"receipts_id" integer,
  	"payments_id" integer,
  	"events_id" integer,
  	"registrations_id" integer,
  	"delegate_assignments_id" integer,
  	"sponsors_id" integer,
  	"trainers_id" integer,
  	"registration_batches_id" integer,
  	"committees_id" integer,
  	"event_committees_id" integer,
  	"organs_id" integer,
  	"institutions_id" integer,
  	"secretariat_id" integer,
  	"countries_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_our_team" ADD CONSTRAINT "pages_blocks_our_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_secretariat_fk" FOREIGN KEY ("secretariat_id") REFERENCES "public"."secretariat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_batch_id_registration_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."registration_batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegates" ADD CONSTRAINT "delegates_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_batch_id_registration_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."registration_batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_delegate_id_delegates_id_fk" FOREIGN KEY ("delegate_id") REFERENCES "public"."delegates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "receipts" ADD CONSTRAINT "receipts_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_registered_by_id_users_id_fk" FOREIGN KEY ("registered_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_delegate_id_delegates_id_fk" FOREIGN KEY ("delegate_id") REFERENCES "public"."delegates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "delegate_assignments" ADD CONSTRAINT "delegate_assignments_event_committee_id_event_committees_id_fk" FOREIGN KEY ("event_committee_id") REFERENCES "public"."event_committees"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trainers" ADD CONSTRAINT "trainers_photo_id_portraits_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."portraits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registration_batches" ADD CONSTRAINT "registration_batches_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_committee_photo_id_media_id_fk" FOREIGN KEY ("committee_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_committees" ADD CONSTRAINT "event_committees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_committees" ADD CONSTRAINT "event_committees_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portraits_fk" FOREIGN KEY ("portraits_id") REFERENCES "public"."portraits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegates_fk" FOREIGN KEY ("delegates_id") REFERENCES "public"."delegates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoice_items_fk" FOREIGN KEY ("invoice_items_id") REFERENCES "public"."invoice_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_receipts_fk" FOREIGN KEY ("receipts_id") REFERENCES "public"."receipts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delegate_assignments_fk" FOREIGN KEY ("delegate_assignments_id") REFERENCES "public"."delegate_assignments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trainers_fk" FOREIGN KEY ("trainers_id") REFERENCES "public"."trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registration_batches_fk" FOREIGN KEY ("registration_batches_id") REFERENCES "public"."registration_batches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committees_fk" FOREIGN KEY ("committees_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_committees_fk" FOREIGN KEY ("event_committees_id") REFERENCES "public"."event_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organs_fk" FOREIGN KEY ("organs_id") REFERENCES "public"."organs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institutions_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_secretariat_fk" FOREIGN KEY ("secretariat_id") REFERENCES "public"."secretariat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_institution_idx" ON "users" USING btree ("institution_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "pages_blocks_our_team_order_idx" ON "pages_blocks_our_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_our_team_parent_id_idx" ON "pages_blocks_our_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_our_team_path_idx" ON "pages_blocks_our_team" USING btree ("_path");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_secretariat_id_idx" ON "pages_rels" USING btree ("secretariat_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "portraits_updated_at_idx" ON "portraits" USING btree ("updated_at");
  CREATE INDEX "portraits_created_at_idx" ON "portraits" USING btree ("created_at");
  CREATE UNIQUE INDEX "portraits_filename_idx" ON "portraits" USING btree ("filename");
  CREATE INDEX "delegates_registration_idx" ON "delegates" USING btree ("registration_id");
  CREATE INDEX "delegates_batch_idx" ON "delegates" USING btree ("batch_id");
  CREATE INDEX "delegates_institution_idx" ON "delegates" USING btree ("institution_id");
  CREATE INDEX "delegates_updated_at_idx" ON "delegates" USING btree ("updated_at");
  CREATE INDEX "delegates_created_at_idx" ON "delegates" USING btree ("created_at");
  CREATE INDEX "registration_idx" ON "delegates" USING btree ("registration_id");
  CREATE INDEX "batch_idx" ON "delegates" USING btree ("batch_id");
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
  CREATE INDEX "receipts_recipient_idx" ON "receipts" USING btree ("recipient_id");
  CREATE INDEX "receipts_pdf_idx" ON "receipts" USING btree ("pdf_id");
  CREATE INDEX "receipts_updated_at_idx" ON "receipts" USING btree ("updated_at");
  CREATE INDEX "receipts_created_at_idx" ON "receipts" USING btree ("created_at");
  CREATE UNIQUE INDEX "receiptNumber_idx" ON "receipts" USING btree ("receipt_number");
  CREATE UNIQUE INDEX "payment_idx" ON "receipts" USING btree ("payment_id");
  CREATE UNIQUE INDEX "payments_payment_number_idx" ON "payments" USING btree ("payment_number");
  CREATE INDEX "payments_registration_idx" ON "payments" USING btree ("registration_id");
  CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");
  CREATE UNIQUE INDEX "payments_transaction_reference_idx" ON "payments" USING btree ("transaction_reference");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE UNIQUE INDEX "paymentNumber_idx" ON "payments" USING btree ("payment_number");
  CREATE UNIQUE INDEX "transactionReference_idx" ON "payments" USING btree ("transaction_reference");
  CREATE INDEX "invoice_1_idx" ON "payments" USING btree ("invoice_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "registrations_registration_number_idx" ON "registrations" USING btree ("registration_number");
  CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");
  CREATE INDEX "registrations_registered_by_idx" ON "registrations" USING btree ("registered_by_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE INDEX "registrationNumber_idx" ON "registrations" USING btree ("registration_number");
  CREATE UNIQUE INDEX "event_registeredBy_idx" ON "registrations" USING btree ("event_id","registered_by_id");
  CREATE INDEX "event_idx" ON "registrations" USING btree ("event_id");
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
  CREATE INDEX "committees_committee_photo_idx" ON "committees" USING btree ("committee_photo_id");
  CREATE UNIQUE INDEX "committees_committee_code_idx" ON "committees" USING btree ("committee_code");
  CREATE INDEX "committees_updated_at_idx" ON "committees" USING btree ("updated_at");
  CREATE INDEX "committees_created_at_idx" ON "committees" USING btree ("created_at");
  CREATE UNIQUE INDEX "committee_code_idx" ON "committees" USING btree ("committee_code");
  CREATE INDEX "event_committees_event_idx" ON "event_committees" USING btree ("event_id");
  CREATE INDEX "event_committees_committee_idx" ON "event_committees" USING btree ("committee_id");
  CREATE INDEX "event_committees_updated_at_idx" ON "event_committees" USING btree ("updated_at");
  CREATE INDEX "event_committees_created_at_idx" ON "event_committees" USING btree ("created_at");
  CREATE UNIQUE INDEX "event_committee_idx" ON "event_committees" USING btree ("event_id","committee_id");
  CREATE INDEX "organs_updated_at_idx" ON "organs" USING btree ("updated_at");
  CREATE INDEX "organs_created_at_idx" ON "organs" USING btree ("created_at");
  CREATE UNIQUE INDEX "code_idx" ON "organs" USING btree ("code");
  CREATE UNIQUE INDEX "institutions_normalized_name_idx" ON "institutions" USING btree ("normalized_name");
  CREATE INDEX "institutions_updated_at_idx" ON "institutions" USING btree ("updated_at");
  CREATE INDEX "institutions_created_at_idx" ON "institutions" USING btree ("created_at");
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
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_portraits_id_idx" ON "payload_locked_documents_rels" USING btree ("portraits_id");
  CREATE INDEX "payload_locked_documents_rels_delegates_id_idx" ON "payload_locked_documents_rels" USING btree ("delegates_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_invoice_items_id_idx" ON "payload_locked_documents_rels" USING btree ("invoice_items_id");
  CREATE INDEX "payload_locked_documents_rels_receipts_id_idx" ON "payload_locked_documents_rels" USING btree ("receipts_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");
  CREATE INDEX "payload_locked_documents_rels_delegate_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("delegate_assignments_id");
  CREATE INDEX "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX "payload_locked_documents_rels_trainers_id_idx" ON "payload_locked_documents_rels" USING btree ("trainers_id");
  CREATE INDEX "payload_locked_documents_rels_registration_batches_id_idx" ON "payload_locked_documents_rels" USING btree ("registration_batches_id");
  CREATE INDEX "payload_locked_documents_rels_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("committees_id");
  CREATE INDEX "payload_locked_documents_rels_event_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("event_committees_id");
  CREATE INDEX "payload_locked_documents_rels_organs_id_idx" ON "payload_locked_documents_rels" USING btree ("organs_id");
  CREATE INDEX "payload_locked_documents_rels_institutions_id_idx" ON "payload_locked_documents_rels" USING btree ("institutions_id");
  CREATE INDEX "payload_locked_documents_rels_secretariat_id_idx" ON "payload_locked_documents_rels" USING btree ("secretariat_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_our_team" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "portraits" CASCADE;
  DROP TABLE "delegates" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "invoice_items" CASCADE;
  DROP TABLE "receipts" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "delegate_assignments" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "trainers" CASCADE;
  DROP TABLE "registration_batches" CASCADE;
  DROP TABLE "committees" CASCADE;
  DROP TABLE "event_committees" CASCADE;
  DROP TABLE "organs" CASCADE;
  DROP TABLE "institutions" CASCADE;
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
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
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
  DROP TYPE "public"."enum_forms_confirmation_type";`)
}

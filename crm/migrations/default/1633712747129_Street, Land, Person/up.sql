
SET check_function_bodies = false;

CREATE TABLE "public"."street" ("id" uuid NOT NULL, "name" Text NOT NULL, PRIMARY KEY ("id") );

CREATE TABLE "public"."land" ("id" uuid NOT NULL, "street_id" uuid NOT NULL, "number" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("street_id") REFERENCES "public"."street"("id") ON UPDATE restrict ON DELETE restrict);

CREATE TABLE "public"."person" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "firstname" text NOT NULL, "lastname" Text NOT NULL, "middlename" text, "birth_date" date, "phone" text NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."land" add column "cadastral_number" text
 null unique;

alter table "public"."land" add column "square" integer
 not null;

alter table "public"."land" add column "created_at" timestamptz
 null default now();

alter table "public"."person" add column "created_at" timestamptz
 null default now();

alter table "public"."street" add column "created_at" timestamptz
 null default now();

CREATE TABLE "public"."land_ownership" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "land_id" uuid NOT NULL, "since" date, "until" date, PRIMARY KEY ("id") , FOREIGN KEY ("land_id") REFERENCES "public"."land"("id") ON UPDATE restrict ON DELETE restrict);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."land_owner" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "ownership_id" uuid NOT NULL, "owner_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("ownership_id") REFERENCES "public"."land_ownership"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("owner_id") REFERENCES "public"."person"("id") ON UPDATE restrict ON DELETE restrict);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."payment" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "ownership_id" uuid NOT NULL, "amount" bigint NOT NULL, "comment" text, PRIMARY KEY ("id") , FOREIGN KEY ("ownership_id") REFERENCES "public"."land_ownership"("id") ON UPDATE restrict ON DELETE restrict);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."land_ownership" add column "created_at" timestamptz
 not null default now();

alter table "public"."land" alter column "id" set default gen_random_uuid();

alter table "public"."street" alter column "id" set default gen_random_uuid();

alter table "public"."payment" add column "payment_at" date
 not null;


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."land_owner";

alter table "public"."land_owner"
  add constraint "land_owner_ownership_id_fkey"
  foreign key ("ownership_id")
  references "public"."land_ownership"
  ("id") on update restrict on delete restrict;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."land_ownership" add column "owner_id" uuid
--  not null;


alter table "public"."land_ownership" add column "owner_id" uuid
 not null;

alter table "public"."land_owner" drop constraint "land_owner_ownership_id_fkey";

DROP table "public"."land_owner";


alter table "public"."land_ownership" drop constraint "land_ownership_owner_id_fkey";

alter table "public"."person" alter column "firstname" set not null;

alter table "public"."person" alter column "lastname" set not null;

alter table "public"."person" alter column "phone" set not null;

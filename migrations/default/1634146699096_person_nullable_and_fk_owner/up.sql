
alter table "public"."person" alter column "phone" drop not null;

alter table "public"."person" alter column "lastname" drop not null;

alter table "public"."person" alter column "firstname" drop not null;

alter table "public"."land_ownership"
  add constraint "land_ownership_owner_id_fkey"
  foreign key ("owner_id")
  references "public"."person"
  ("id") on update restrict on delete restrict;

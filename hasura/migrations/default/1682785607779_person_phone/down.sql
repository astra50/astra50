DROP TRIGGER set_person_phone_is_main_to_false ON public.person_phone;

DROP FUNCTION public.set_person_phone_is_main_to_false();

--- Restore second phone

ALTER TABLE public.person ADD COLUMN phone_second text;

--- Migrate data

UPDATE person
   SET phone_second = (SELECT phone FROM public.person_phone WHERE is_main IS FALSE AND person_id = person.id LIMIT 1)
 WHERE person.phone_second IS NULL;

UPDATE person
   SET phone = (SELECT phone FROM public.person_phone WHERE is_main IS TRUE AND person_id = person.id)
 WHERE phone IS NULL;

--- Drop table

DROP TABLE public.person_phone;

---

DROP DOMAIN public.phone_number;

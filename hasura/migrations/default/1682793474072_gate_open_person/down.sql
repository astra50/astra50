--- gate person on telegram

DROP TRIGGER gate_open_set_person_on_telegram_id ON public.person;
DROP FUNCTION public.gate_open_set_person_on_telegram_id();

--- gate person on phone

DROP TRIGGER gate_open_set_person_on_phone ON public.person_phone;
DROP FUNCTION public.gate_open_set_person_on_phone();

--- gate person on email

DROP TRIGGER gate_open_set_person_on_email ON public.person_email;
DROP FUNCTION public.gate_open_set_person_on_email();

---

DROP TRIGGER gate_open_find_person_id ON public.gate_open;
DROP FUNCTION public.gate_open_find_person_id();
ALTER TABLE gate_open DROP COLUMN person_id;

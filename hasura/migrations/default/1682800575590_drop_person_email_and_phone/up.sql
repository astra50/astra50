ALTER TABLE public.person DROP COLUMN phone;

DROP TRIGGER set_person_email ON public.person;
DROP FUNCTION public.set_person_email();
ALTER TABLE public.person DROP COLUMN email;

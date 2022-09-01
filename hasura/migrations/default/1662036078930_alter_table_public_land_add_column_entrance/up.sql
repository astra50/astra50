ALTER TABLE public.land ADD COLUMN coordinates point NULL;

ALTER TABLE public.gate ADD COLUMN coordinates point NULL;
ALTER TABLE public.gate ADD COLUMN number integer NULL;

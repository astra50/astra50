ALTER TABLE public.gate ADD COLUMN delay integer DEFAULT 30 NOT NULL;
ALTER TABLE public.gate ALTER COLUMN delay DROP DEFAULT;
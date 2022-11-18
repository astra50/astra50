ALTER TABLE public.target_payment ADD CONSTRAINT zero_amount_not_allowed CHECK ( amount <> 0 );

ALTER TABLE public.member_payment ADD CONSTRAINT zero_amount_not_allowed CHECK ( amount <> 0 OR created_at = '2021-11-14 21:36:53.072291 +00:00'::timestamptz );

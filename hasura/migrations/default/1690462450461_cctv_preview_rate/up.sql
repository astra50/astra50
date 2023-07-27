ALTER TABLE gate ADD COLUMN cctv_preview_rate integer NOT NULL DEFAULT 0
    CONSTRAINT NOT_LOWER_THEN_2000 CHECK ( cctv_preview_rate = 0 OR cctv_preview_rate >= 2000 );

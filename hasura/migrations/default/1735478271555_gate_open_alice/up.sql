INSERT INTO gate_open_reason (id, name)
VALUES ('alice', 'Алиса')
ON CONFLICT DO NOTHING;

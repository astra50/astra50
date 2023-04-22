CREATE VIEW payment_with_refinance_rate
AS
SELECT *
  FROM ((SELECT paid_at AS date,
                (SELECT rate FROM refinance_rate WHERE since < mp.paid_at ORDER BY since DESC LIMIT 1) AS rate,
                mp.amount,
                mp.balance,
                CASE WHEN mp.amount > 0 THEN 'paid' ELSE 'debt' END AS type,
                mp.account_id AS account_id
           FROM member_payment mp)
   UNION
  (SELECT since AS date, rate, NULL, NULL, 'ref_tax', NULL FROM refinance_rate)) sub
 ORDER BY date DESC;

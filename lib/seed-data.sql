INSERT INTO categories (title)
VALUES ('Pet'),
       ('Food'),
       ('Kids');

INSERT INTO expenses (title, amount, expense_date, category_id)
VALUES ('Food', 22.75, DEFAULT, 1),
       ('Hairdressing', 35.00, '2023-10-10', 1),
       ('Kimono', 24.50, DEFAULT, 3);


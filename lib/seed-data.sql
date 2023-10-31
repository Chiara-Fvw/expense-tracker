INSERT INTO categories (title, username)
VALUES ('Pet', 'admin'),
       ('Food', 'developer'),
       ('Kids', 'admin');

INSERT INTO expenses (title, amount, expense_date, username, category_id)
VALUES ('Food', 22.75, DEFAULT, 'admin', 1),
       ('Hairdressing', 35.00, '2023-10-10', 'admin', 1),
       ('Pancakes', 3.40, '2023-10-19', 'developer', 2),
       ('Kimono', 24.50, DEFAULT, 'admin', 3);


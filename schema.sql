CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text NOT NULL,
  username text NOT NULL
);

CREATE TABLE expenses (
  id serial PRIMARY KEY,
  title text NOT NULL,
  amount numeric(9, 2) NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  username text NOT NULL,
  category_id integer REFERENCES categories(id) 
              ON DELETE CASCADE
);
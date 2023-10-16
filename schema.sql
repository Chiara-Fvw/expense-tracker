CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar(20) NOT NULL,
  password varchar(18) NOT NULL
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text NOT NULL
);

CREATE TABLE expenses (
  id serial PRIMARY KEY,
  title text NOT NULL,
  amount numeric(9, 2) NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  category_id integer REFERENCES categories(id) 
              ON DELETE CASCADE
);
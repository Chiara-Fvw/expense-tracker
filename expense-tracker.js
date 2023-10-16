const express = require("express");
const morgan = require("morgan");
const PgPersistence = require("./lib/pg-persistence");

const app = express();
const host = "localhost";
const port = 3001;
const Category = require("./lib/category");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public")); //here we use `use` as express calls the func every time it receives an HTTP request.
app.use(morgan("common")); //for the logging
app.use(express.static("public")); //telling express where to achieve static content.
app.use(express.urlencoded({ extended: false })); //middleware to process data sent from client to server through forms or post reqeusts. Is necessary for forms

//Create a new Data store: 
app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
})

app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/categories", async(req, res) => {
  let categories = await res.locals.store.listCategories();
  res.render("categories", {
    categories
  });
});

app.get("/expenses/:expenseId", async(req, res) => {
  let id = req.params.expenseId;
  let categoryTitle = await res.locals.store.getCategoryTitle(+id);
  let expenses = await res.locals.store.expensesOfCategory(+id);

  res.render("expenses", { 
    expenses,
    categoryTitle
   });
})  

// app.post("/users/signin", )


//Listener
app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}.`);
});




// let pet = new Category(1, 'Pet');

// pet.createNewExpense(1, 'cigarros', 27.50, '11/07/2023');
// pet.createNewExpense(2, 'food', 30.00, '9/9/24');

// pet.expenses[0].modifyExpenseTitle('meds');
// pet.expenses[0].modifyExpenseAmount(72.7);

// pet.createNewExpense(3, 'toys', 23.8, '11/11/24');
// pet.createNewExpense(4, 'brush', 15, '11/11/24');
// pet.logExpenses();
// pet.deleteExpense(4);

// pet.logExpenses();
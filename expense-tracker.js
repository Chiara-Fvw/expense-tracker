const express = require("express"); //returns a function to create an application object
const morgan = require("morgan"); //logging module
const flash = require("express-flash");
const session = require("express-session"); //Provides features to manage sessions
const { body, validationResult } = require("express-validator");
const PgPersistence = require("./lib/pg-persistence");

const app = express(); //we call the function to create the application object app
const host = "localhost";
const port = 3001;
const Category = require("./lib/category");

app.set("views", "./views"); //Tells express to look for view templates in the views directory
app.set("view engine", "pug"); //Tells express to use Pug as template engine

app.use(express.static("public")); //here we use `use` as express calls the func every time it receives an HTTP request.
app.use(morgan("common")); //sets the output log format to the “common” format
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  },
  name: "expense-tracker-sessionId",
  resave: false,
  saveUninitialized: true,
  secret: "This is not secure at all",
}));
app.use(flash());
app.use(express.static("public")); //telling express where to achieve static content.
app.use(express.urlencoded({ extended: false })); //middleware to process data sent from client to server through forms or post requests. Is necessary for forms

//Create a new Data store: 
app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
});

//Middleware that stores the flash object from req.session in res.locals.flash. This is one case in wich we can pass data to views using res.locals (instead of app.locals)
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;   //delete after we save a reference to it in res.locals.flash. If we don't delete it, flash messages persist from one request to the next and never go away.
  next();
})

//Route that handles an HTTP GET request fot the path `/``
//The function argument is a callback (route controller or route handler) 
//that `get`calls when receives a request
app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

//Render category list
app.get("/categories", async(req, res, next) => {
  let categories = await res.locals.store.categoriesOrderedBy('title');
  //Validating
  if(!categories) {
    next(new Error(`There are no categories in the list.`));
  } else {
    res.render("categories", {
      categories
    });
  };
});

//Render the expenses of a particular category.
app.get("/expenses/:categoryId", async(req, res) => {
  let categoryId = req.params.categoryId;
  let categoryTitle = await res.locals.store.getCategoryTitle(+categoryId);
  let expenses = await res.locals.store.expensesOfCategory(+categoryId);

  res.render("expenses", { 
    expenses,
    categoryTitle,
    categoryId
   });
});

//Ordering category list.
app.get("/categories/orderby/title", async(req, res) => {
  res.redirect("/categories");
});

app.get("/categories/orderby/amount", async(req, res) => {
  let categories = await res.locals.store.categoriesOrderedBy('amount');
  
  res.render("categories", {
    categories
  });
});

app.get("/categories/:categoryId/edit", async(req, res) => {
  let id = req.params.categoryId;
  let categoryInfo = await res.locals.store.getCategoryInfo(id);

  res.render("edit-category", { categoryInfo });
});

//Edit a category
app.post("/categories/:categoryId/edit", async(req, res) => {
  let catId = req.params.categoryId;
  let catTitle = req.body.categoryTitle;
  let updated = await res.locals.store.updateCategoryTitle(catId, catTitle);
  if (!updated) Window.alert("SOMETHING IS NOT WORKING PROPERLY...");

  res.redirect("/categories");
});

//Add a new category
app.get("/categories/new", (req, res) => {
  res.render("new-category");
});

app.post("/categories", async(req, res) => {
  let catTitle = req.body.categoryTitle.trim();

  if (catTitle.length === 0) {
    req.flash("error", "The category title must be provided.");
    res.render("new-category", {
      flash: req.flash()    //We have to define a flash variable when calling res.render
    });
  } else {
    let created = await res.locals.store.newCategory(catTitle);
    req.flash("success", "The new category has been created.");
    res.redirect("/categories");
  };
});

//Delete a category
app.post("/categories/:categoryId/delete", async(req, res) => {
  let id = req.params.categoryId;
  let deleted = await res.locals.store.deleteCategory(id);

  if(!deleted) Window.alert("SOMETHING IS NOT WORKING PROPERLY...");
  res.redirect("/categories");
});

//Order expenses

app.get("/expenses/:categoryId/orderby/:column", async(req, res) => {
  let categoryId = req.params.categoryId;
  let column = req.params.column;
  let expenses = await res.locals.store.sortedExpenses(categoryId, column);
  let categoryTitle = await res.locals.store.getCategoryTitle(categoryId);

  res.render("expenses", {
    expenses,
    categoryTitle,
    categoryId
  });
});

//Add a new expense
app.get(`/expenses/:categoryId/new`, (req, res) => {
  let categoryId = req.params.categoryId;
  res.render("new-expense", { categoryId });
});

app.post("/expenses/:categoryId", async(req, res) => {
  let categoryId = req.params.categoryId;
  let title = req.body.expenseTitle;
  let amount = req.body.expenseAmount;
  let date = req.body.expenseDate;

  let created = await res.locals.store.addExpense(categoryId, title, amount, date);
  if (!created) Window.alert("SOMETHING IS NOT WORKING PROPERLY...");

  res.redirect(`/expenses/${categoryId}`);
});

//Edit expense
app.get("/expenses/:expenseId/edit", async(req, res) => {
  let expenseId = req.params.expenseId;

  let expenseInfo = await res.locals.store.renderExpense(expenseId);
  let date = expenseInfo.expense_date.toLocaleString().split(',')[0].split('/').map(elm => elm.padStart(2, '0'));
  let [day, month, year] = date;
  let transformedDate = ([day, month, year] = [year, month, day]).join('-');

  res.render("edit-expense", { expenseInfo, transformedDate });
}); 

app.post("/expenses/:expenseId/:categoryId/edit", async(req, res) => {
  let expenseId = req.params.expenseId;
  let categoryId = req.params.categoryId
  let title = req.body.expenseTitle;
  let amount = req.body.expenseAmount;
  let e_date = req.body.expenseDate;

  let updated = await res.locals.store.updateExpense(expenseId, title, amount, e_date);

  res.redirect(`/expenses/${categoryId}`);
});

// app.post("/users/signin", )

//Error handler
app.use((err, req, res, _next) => {
  console.log(err); //Writes more extensive information to the log
  res.status(404).send(err.message);
});

//Listener: method that tells the application to start listening for the requests on the given port:
app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}.`);
});
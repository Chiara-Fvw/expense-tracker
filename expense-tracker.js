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
});

app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

//Render category list
app.get("/categories", async(req, res) => {
  let categories = await res.locals.store.categoriesOrderedBy('title');

  res.render("categories", {
    categories
  });
});

//Render the expenses of a particular category.
app.get("/expenses/:categoryId", async(req, res) => {
  let id = req.params.categoryId;
  let categoryTitle = await res.locals.store.getCategoryTitle(+id);
  let expenses = await res.locals.store.expensesOfCategory(+id);

  res.render("expenses", { 
    expenses,
    categoryTitle,
    id
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
})
// app.post("/users/signin", )


//Listener
app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}.`);
});
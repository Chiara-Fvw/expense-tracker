const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PgPersistence {
  constructor(session) {
    //We use the constructor because we need to get the user's name from the session object.
    this.username = session.username;
  }

  //Returns all the categories ordered by title or amount.
  async categoriesOrderedBy(method) {
    const CATEGORIES = "SELECT * FROM categories WHERE username = $1 ORDER BY title";
    const AMOUNT = "SELECT category_id, sum(amount) FROM expenses WHERE username = $1 GROUP BY category_id";

    let resultCat = await dbQuery(CATEGORIES, this.username);
    let resultExp = await dbQuery(AMOUNT, this.username);
    let resultS = await Promise.all([resultCat, resultExp]);

    let allCategories = resultS[0].rows;
    let allExpenses = resultS[1].rows;

    allCategories.forEach(category => {
      let total = allExpenses.filter(expense => {
        return expense.category_id === category.id;
      })[0];

      category.amount = total ? Number(total.sum).toFixed(2) : (0).toFixed(2);
    });

    if (method === 'title') {
      return allCategories;
    } else {
      return allCategories.sort((a, b) =>  b.amount - a.amount);
    };
  }

  //returns the expenses for a given category
  async expensesOfCategory(id) {
    const EXPENSES = "SELECT * FROM expenses WHERE category_id = $1  AND username = $2 ORDER BY title";

    let result = await dbQuery(EXPENSES, id, this.username);
    return result.rows;
  } 

  async getCategoryInfo(id) {
    const CATEGORY = "SELECT * FROM categories WHERE id = $1";

    let result = await dbQuery(CATEGORY, id);

    return result.rows[0];
  }

  //Returns the expense's category title
  async getCategoryTitle(id) {
    const TITLE = "SELECT title FROM categories WHERE id=$1";

    let result = await dbQuery(TITLE, id);
    return result.rows[0].title;
  }

  //Edit category title
  async updateCategoryTitle(id, newTitle) {
    const UPDATE_CATEGORY = "UPDATE categories SET title = $1 WHERE id = $2";
    
    let result = await dbQuery(UPDATE_CATEGORY, newTitle, id);
    return result.rowCount > 0;
  }

  //Add a new Category
  async newCategory(title) {
    const NEW_CATEGORY = "INSERT INTO categories (title, username) VALUES ($1, $2)";
    
    let result = await dbQuery(NEW_CATEGORY, title, this.username);
    return result.rowCount > 0;
  }

  //Delete a category
  async deleteCategory(id) {
    const DELETE_CATEGORY = "DELETE FROM categories WHERE id = $1";

    let result = await dbQuery(DELETE_CATEGORY, id);
    return result.rowCount > 0;
  }

  async renderExpense(id) {
    const EXPENSE = "SELECT * FROM expenses WHERE id = $1";

    let result = await dbQuery(EXPENSE, id);

    return result.rows[0];
  }

  async updateExpense(expenseId, title, amount, e_date) {
    const UPDATE_EXPENSE = "UPDATE expenses SET title = $2, amount=$3, expense_date = $4 WHERE id = $1"
    let result = await dbQuery(UPDATE_EXPENSE, expenseId, title, amount, e_date);

    return result.rowCount > 0;
  };

  //Order expenses
  async sortedExpenses(id, column) {
    const ORDERED_EXPENSES = "SELECT * FROM expenses WHERE category_id = $1  AND username = $2 ORDER BY title ASC";
    let result = await dbQuery(ORDERED_EXPENSES, id, this.username);

    if (column === 'title') {
      result.rows.sort((a, b) => a.title - b.title);
    } else if (column === 'amount') {
      result.rows.sort((a, b) => b.amount - a.amount);
    } else {
      result.rows.sort((a, b) => b.expense_date - a.expense_date);
    };

    return result.rows;
  }

  //Add an expense
  async addExpense(categoryId, title, amount, date) {
    const ADD_EXPENSE = "INSERT INTO expenses (title, amount, expense_date, category_id, username) VALUES ($2, $3, $4, $1, $5)";

    let result = await dbQuery(ADD_EXPENSE, categoryId, title, amount, date, this.username);
    return result.rowCount > 0;
  };

  //Delete the expense
  async deleteExpense(id) {
    const DELETE_EXPENSE = "DELETE FROM expenses WHERE id = $1";

    let result = await dbQuery(DELETE_EXPENSE,  id);
    return result.rowCount > 0;
  };

  //Check if a category already exists.
  async existCategory(title) {
    const MATCH_TITLE = "SELECT FROM categories WHERE title = $1 AND username = $2";

    let result = await dbQuery(MATCH_TITLE, title, this.username);
    return result.rowCount > 0;
  }

  //Returns a Promise that resolves to "true" if the username and password combine to identify a legitimate user, false if either credentials is invalid.
  //Authentication checker
  async authenticate(username, password) {
    const FIND_HASHED_PASSWORD = "SELECT password FROM users WHERE username = $1";

    let result = await dbQuery(FIND_HASHED_PASSWORD, username);
    if (result.rowCount === 0) return false;
    return bcrypt.compare(password, result.rows[0].password);
  };
};
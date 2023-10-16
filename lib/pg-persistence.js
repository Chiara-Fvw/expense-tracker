const { dbQuery } = require("./db-query");

module.exports = class PgPersistence {
  //Returns all the categories
  async listCategories() {
    const CATEGORIES = "SELECT * FROM categories";

    let result = await dbQuery(CATEGORIES);
    return result.rows;
  }

  //returns the expenses for a given category
  async expensesOfCategory(id) {
    let EXPENSES = "SELECT * FROM expenses WHERE category_id = $1";

    let result = await dbQuery(EXPENSES, id);
    return result.rows;
  } 

  //Returns the expense title
  async getCategoryTitle(id) {
    let TITLE = "SELECT title FROM categories WHERE id=$1";

    let result = await dbQuery(TITLE, id);
    return result.rows[0].title;
  }
  
};
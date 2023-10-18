const { dbQuery } = require("./db-query");

module.exports = class PgPersistence {

  //Returns all the categories ordered by title or amount.
  async categoriesOrderedBy(method) {
    const CATEGORIES = "SELECT * FROM categories ORDER BY title";
    const AMOUNT = "SELECT category_id, sum(amount) FROM expenses GROUP BY category_id";

    let resultCat = await dbQuery(CATEGORIES);
    let resultExp = await dbQuery(AMOUNT);
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
      return allCategories.sort((a, b) =>  a.amount - b.amount);
    };
  }

  //returns the expenses for a given category
  async expensesOfCategory(id) {
    const EXPENSES = "SELECT * FROM expenses WHERE category_id = $1";

    let result = await dbQuery(EXPENSES, id);
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
};
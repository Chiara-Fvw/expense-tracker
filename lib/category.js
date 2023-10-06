const Expense = require("./expense");

class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.expenses = [];
  }

  createNewExpense(id, title, amount, date) {
    this.expenses.push(new Expense(id, title, amount, date, this.id));
  }

  deleteExpense(id) {
    //find the expense index;
    let index = this.expenses.findIndex((expense) => expense.id === id);
    //delete the expense from the array
    this.expenses.splice(index, 1);
  }

  logExpenses() {
    console.log(`Category: ${this.name}`);
    console.log('-'.repeat(30));
    this.expenses.forEach(expense => 
      console.log(`${expense.title}: ${(expense.amount).toFixed(2)}`))
  }

  modifyCategoryName(name) {
    this.name = name;
  }
  
};

module.exports = Category;
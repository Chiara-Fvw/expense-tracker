class Expense {
  constructor(id, title, amount, date, category) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.date = date;
    this.category = category;
  }

  modifyExpenseTitle(title) {
    this.title = title;
  }

  modifyExpenseAmount(amount) {
    this.amount = amount;
  }

  modifyExpenseDate(date) {
    this.date = date;
  }

  modifyExpenseCategory(category) {
    this.category = category;
  }
};

module.exports = Expense;
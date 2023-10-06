const Category = require("./lib/category");

let pet = new Category(1, 'Pet');

pet.createNewExpense(1, 'cigarros', 27.50, '11/07/2023');
pet.createNewExpense(2, 'food', 30.00, '9/9/24');

pet.expenses[0].modifyExpenseTitle('meds');
pet.expenses[0].modifyExpenseAmount(72.7);

pet.createNewExpense(3, 'toys', 23.8, '11/11/24');
pet.createNewExpense(4, 'brush', 15, '11/11/24');
pet.logExpenses();
pet.deleteExpense(4);

pet.logExpenses();
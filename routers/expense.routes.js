const express = require('express');
const { 
    AddExpense,
    EditExpense,
    DeleteExpense,
    CurrentExpense,
    MonthlyExpense,
    YearlyExpense,
    GetExpensesCategories,
    GetIncomeCategories, 
    AddCategory,
    EditCategory,
    DeleteCategory} = require('../controllers/expense.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

const expenseRouter = express.Router();

expenseRouter.get('/current', isLoggedIn, CurrentExpense);
expenseRouter.get('/monthly', isLoggedIn, MonthlyExpense);
expenseRouter.get('/yearly', isLoggedIn, YearlyExpense);
expenseRouter.post('/add', isLoggedIn, AddExpense);
expenseRouter.put('/edit', isLoggedIn, EditExpense);
expenseRouter.delete('/delete', isLoggedIn, DeleteExpense);

expenseRouter.get('/categories/expense', GetExpensesCategories);
expenseRouter.get('/categories/income', GetIncomeCategories);
expenseRouter.post('/categories/add', AddCategory);
expenseRouter.put('/categories/edit', isLoggedIn, EditCategory);
expenseRouter.delete('/categories/delete', isLoggedIn, DeleteCategory);

module.exports = expenseRouter;
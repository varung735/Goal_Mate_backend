const expenseModel = require('../schemas/expense.schema');
const expenseCategoriesModel = require('../schemas/expenseCategory.schema');
const expenseTypes = require('../utils/expenseTypes');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');

/*
@CurrentExpense

@routes
local - http://localhost:4000/api/v1/expenses/current
prod - https://goalmate.render.com/api/v1/expenses/current

**description - This function will get all the expense document which are of the current date

@parameters - userId

@returns - expenses object array
*/
exports.CurrentExpense = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const currentExpenses = await expenseModel.find({ 
        userId: userId,
        type: expenseTypes.expense,
        date: { $gt: startDate, $lt: endDate }
    }).lean();
    
    const currentIcomes = await expenseModel.find({ 
        userId: userId,
        type: expenseTypes.income,
        date: { $gt: startDate, $lt: endDate }
    }).lean();

    res.status(200).json({
        success: true,
        message: 'Got All Current Expense Successfully',
        currentExpenses,
        currentIcomes
    });
});

/*
@MonthlyExpense

@routes
local - http://localhost:4000/api/v1/expenses/monthly
prod - https://goalmate.render.com/api/v1/expenses/monthly

**description - This function will filter the expenses according to the month

@parameters - month (number)

@returns - expense object array
*/
exports.MonthlyExpense = asyncHandler(async (req, res) => {

});

/*
@yearlyExpense

@routes
local - http://localhost:4000/api/v1/expenses/yearly
prod - https://goalmate.render.com/api/v1/expenses/yearly

**description - This function will filter all the expense documents according to the year

@paramter - year (number)

@returns - expense object array
*/
exports.YearlyExpense = asyncHandler(async (req, res) => {

});

/*
@AddExpense

@routes
local - http://localhost:4000/api/v1/expenses/add
prod - https://goalmate.render.com/api/v1/expenses/add

**description - This will add the expense document into the expense collection

@parameters - userId, type, category, amount, date

@returns - success or failure message and added document
*/
exports.AddExpense = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { type, category, description, amount, date } = req.body;

    if(!userId || !type || !category || !description || !amount){
        throw new CustomError('One of fields is missing', 404);
    }

    const expense = await expenseModel.create({
        userId,
        type,
        category,
        description,
        amount,
        date
    }).lean();

    res.status(200).json({
        success: true,
        message: "Added expense successfully",
        expense
    });
});

/*
@EditExpense

@routes
local - http://localhost:4000/api/v1/expenses/edit
prod - https://goalmate.render.com/api/v1/expenses/edit

**description - This will edit the date, type and description in expense schema

@parameters - expenseId, type, category, description

@returns - success or failure message and updated expense object
*/
exports.EditExpense = asyncHandler(async (req, res) => {
    const { expenseId, type, category, description } = req.body;

    if(!expenseId || !type || !category || !description){
        throw new CustomError('One of the fields is missing', 404);
    }

    const expense = await expenseModel.exists({ _id: expenseId }).lean();

    if(!expense){
        throw new CustomError('Expense Doesnot Exists', 404);
    }

    const updatedExpense = await expenseModel.findByIdAndUpdate(expenseId, {
        type,
        category,
        description
    }, { new: true }).lean();

    res.status(200).json({
        success: true,
        message: "Edited Expense Successfully"
    });
});

/*
@DeleteExpense

@routes
local - http://localhost:4000/api/v1/expenses/delete
prod - https://goalmate.render.com/api/v1/expenses/delete

**description - This will delete the existing document in expense schema

@parameters - expenseId

@returns - success or failure message
*/
exports.DeleteExpense = asyncHandler(async (req, res) => {
    const { expenseId } = req.body;

    if(!expenseId){
        throw new CustomError('expenseId is missing', 404);
    }

    const expense = await expenseModel.exists({ _id: expenseId }).lean();

    if(!expense){
        throw new CustomError('Expense Doesnot Exists', 404);
    }

    const deleteExpense = await expenseModel.findByIdAndDelete(expenseId).lean();

    res.status(200).json({
        success: true,
        message: 'Deleted Expense Successfully'
    });
});

/*
@GetExpensesCategories

@routes
local - http://localhost:4000/api/v1/expenses/categories/expense
prod = https://goalmate.render.app/api/v1/expenses/categories/expense

**description - THis function will get all the expenseCategories documents with expense type

@parameters - none

@returns - expenseCategories object array
*/
exports.GetExpensesCategories = asyncHandler(async (req, res) => {
    const expenseCategories = await expenseCategoriesModel.find({ type: expenseTypes.expense });

    res.status(200).json({
        success: true,
        message: 'Got Expenses Category Successfully',
        expenseCategories
    });
});

/*
@GetIncomeCategories

@routes
local - http://localhost:4000/api/v1/expenses/categories/income
prod - https://goalmate.render.app/api/v1/expenses/categories/income

**description - This function will get all the expenseCategories documents with income type

@parameters - none

@returns - expenseCatgories object array
*/
exports.GetIncomeCategories = asyncHandler(async (req, res) => {
    const incomeCategories = await incomeCategories.find({ type: incomeCategories.income });

    res.status(200).json({
        success: true,
        message: 'Got Income Category Successfully',
        incomeCategories
    });
});

/*
@AddCategory

@routes
local - http://localhost:4000/api/v1/expenses/categories/add
prod - https://goalmate.render.app/api/v1/expenses/categories/add

**description - This function will take data from req.body and add it to expenseCategory collection

@parameters - image-url, type, category

@returns - success or failure message and added object
*/
exports.AddCategory = asyncHandler(async (req, res) => {
    const { image_url, type, category } = req.body;

    if(!type || !category){
        throw new CustomError('type or category missing', 404);
    }

    if(type !== expenseTypes.expense || type !== expenseTypes.income){
         throw new CustomError('Invalid value for type', 400);
    }

    const categoryObj = await expenseCategoriesModel.create({
        image_url,
        type,
        category
    });

    res.status(200).json({
        success: true,
        message: 'Added Category Successfully',
        categoryObj
    });
});

/*
@EditCategory

@routes
local - http://localhost:4000/api/v1/expenses/categories/edit
prod - https://goalmate.render.app/api/v1/expenses/categories/edit

**description - This function will take objectId for the category and update the changes in DB

@parameters - objectId, type, category

@returns - updated object
*/
exports.EditCategory = asyncHandler(async (req, res) => {
    const { objectId, type, category } = req.body;

    if(!objectId || !type || !category){
        throw new CustomError('One of the fields missing', 404);
    }

    if(type !== expenseTypes.expense || type !== expenseTypes.income){
        throw new CustomError('Invalid Value for type', 400);
    }

    const categoryObj = await expenseCategoriesModel.findByIdAndUpdate(objectId, {
        type,
        category
    });

    res.status(200).json({
        success: true,
        message: 'Edited Category Successfully',
        categoryObj
    });
});

/*
@DeleteCategory

@routes
local - http://localhost:4000/api/v1/expenses/categories/delete
prod - https://goalmate.render.app/api/v1/expenses/categories/delete

**description - This function would delete the object with the objectId from the DB

@parameters - objectId

@returns - deleted object
*/
exports.DeleteCategory = asyncHandler(async (req, res) => {
    const { objectId } = req.body;

    if(!objectId){
        throw new CustomError('ObjectId is missing', 404);
    }

    const categoryObj = await expenseCategoriesModel.findByIdAndDelete(objectId);

    res.status(200).json({
        success: true,
        message: 'Deleted Object Successfully',
        categoryObj
    });
});
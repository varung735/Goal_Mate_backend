const mongoose = require('mongoose');
const expenseTypes = require('../utils/expenseTypes');

const expenseCategoriesSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: [true, 'Image Url is required']
        },
        type: {
            type: String,
            required: [true, 'Expense type is required'],
            enum: Object.values(expenseTypes)
        },
        category: {
            type: String,
            required: [true, 'Category is required']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Expense_Category', expenseCategoriesSchema);
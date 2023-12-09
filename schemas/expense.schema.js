const mongoose = require('mongoose');
const expenseTypes = require('../utils/expenseTypes');

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        type: {
            type: String,
            enum: Object.values(expenseTypes)
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense_Category'
        },
        description: {
            type: String
        },
        amount: {
            type: Number
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Expense', expenseSchema);
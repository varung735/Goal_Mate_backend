const mongoose = require('mongoose');

const taskGroupSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        group_name: {
            type: String,
            required: [true, 'Task Group Name is required']
        },
        date: {
            type: Date,
            default: Date.now()
        },
        tasks: [{
            task: {
                type: String
            },
            description: {
                type: String
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Task_Group', taskGroupSchema);
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        parentFolderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder'
        },
        title: {
            type: String,
            required: [true, 'Title is required']
        },
        body: {
            type: String,
            required: [true, 'Body is required']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Journal', journalSchema);
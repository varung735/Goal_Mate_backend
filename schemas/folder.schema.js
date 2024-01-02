const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        parentFolderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder'
        },
        folder_name: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Folder', folderSchema);
const folderSchema = require('../schemas/folder.schema');
const journalSchema = require('../schemas/journal.schema');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');

/*
@GetContentInsideMainFolder

@method - GET

@route
local - http://localhost:4000/api/v1/folders/get/main
prod - https://goalmate.render.app/api/v1/folders/get/main

**description - This function gets all the folders and journals inside main folder

@parameters - userId

@returns - array
*/
exports.GetContentInsideMainFolder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const folder = await folderSchema.findOne({ 
        userId: userId,
        folder_name: 'Main'
    });
    
    const folders = await folderSchema.find({ parentFolderId: folder._id }).select('folder_name');
    const journals = await journalSchema.find({ parentFolderId: folder._id }).select('title');

    res.status(200).json({
        success: true,
        message: 'Got All Folders Successfully',
        folders,
        journals
    });
});

/*
@GetContentInsideSubFolder

@method - GET

@routes
local - http://localhost:4000/api/v1/folders/get/sub_folder?id=folder_id
prod - https://goalmate.render.app/api/v1/folders/get/sub_folder?id=folder_id

**description - This function will get all the folders with parentFolderId of the provided Id

@parameters - userId, folderId

@returns - folders object array, journals object array
*/
exports.GetContentInsideSubFolder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { folderId } = req.query;

    if(!folderId){
        throw new CustomError('Folder Id is missing', 404);
    }

    const folder = await folderSchema.findById(folderId);

    if(folder === null){
        throw new CustomError('Folder Doesnot Exists', 404);
    }

    const folders = await folderSchema.find({
        userId: userId,
        parentFolderId: folderId
    }).select('folder_name');

    const journals = await journalSchema.find({
        userId: userId,
        parentFolderId: folderId
    }).select('title');

    res.status(200).json({
        success: true,
        message: 'Got all Folders Successfully',
        folders,
        journals
    });
});

/*
@CreateFolder

@method: POST

@routes
local - http://localhost:4000/api/v1/folders/create
prod - https://goalmate.render.app/api/v1/folders/create

**description - This function will create a new folder in folders collection in DB

@parameters - userId, folderId, folder_name

@returns - success or failure message
*/
exports.CreateFolder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { folderId, folderName } = req.body;

    if(!folderId || !folderName ){
        throw new CustomError('Either of the fields missing', 404);
    }

    if(folderName.toLowerCase() === 'main'){
        throw new CustomError('Invalid Folder Name', 401);
    }

    const folder = await folderSchema.create({
        userId,
        parentFolderId: folderId,
        folder_name: folderName
    });

    res.status(200).json({
        success: true,
        message: 'Folder Created Successfully'
    });
});

/*
@EditFolderName

@method: PATCH

@routes
local - http://localhost:4000/api/v1/folders/edit
prod - https://goalmate.render.app/api/v1/folders/edit

**description - This folder will edit the folder name present in the DB

@parameters - userId, folderId, folderName

@returns - success or failure message
*/
exports.EditFolderName = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { folderId, folderName } = req.body;

    if(!folderId || !folderName){
        throw new CustomError('Either of the fields are missing', 404);
    }

    if(folderName.toLowerCase() === 'main'){
        throw new CustomError('Invalid folder name', 401);
    }

    const folder = await folderSchema.findByIdAndUpdate(folderId, {
        folder_name: folderName
    }, { new: true });

    res.status(200).json({
        success: true,
        message: 'Updated Folder Name Successfully'
    });
});

/*
@DeleteFolder

@method: DELETE

@routes
local - http://localhost:4000/api/v1/folders/delete
prod - https://goalmate.render.app/api/v1/folders/delete

**description - This function would delete the folder in the DB

@paramters - folderId
*/
exports.DeleteFolder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { folderId } = req.body;

    if(!folderId){
        throw new CustomError('FolderId is Missing', 404);
    }

    const folder = await folderSchema.findById(folderId, 'folder_name');

    if(folder.folder_name.toLowerCase() === 'main'){
        throw new CustomError('Cannot Delete Main Folder', 403);
    }

    const journals = await journalSchema.countDocuments({ parentFolderId: folderId });
    const folders = await folderSchema.countDocuments({ parentFolderId: folderId });

    if(journals > 0){
        throw new CustomError('Empty the folder before deleting', 403);
    }

    if(folders > 0){
        throw new CustomError('Empty the folder before deleting', 403);
    }

    const deletedFolder = await folderSchema.findByIdAndDelete(folderId);

    res.status(200).json({
        success: true,
        message: 'Folder Deleted Successfully'
    });
});
const express = require('express');
const isLoggedIn = require('../middlewares/auth.middleware');
const { GetContentInsideMainFolder, CreateFolder, EditFolderName, DeleteFolder, GetContentInsideSubFolder } = require('../controllers/folder.controller');

const folderRouter = express.Router();

folderRouter.get('/get/main', isLoggedIn, GetContentInsideMainFolder);
folderRouter.get('/get/sub_folder', isLoggedIn, GetContentInsideSubFolder);
folderRouter.post('/create', isLoggedIn, CreateFolder);
folderRouter.patch('/edit', isLoggedIn, EditFolderName);
folderRouter.delete('/delete', isLoggedIn, DeleteFolder);

module.exports = folderRouter;
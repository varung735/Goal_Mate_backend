const express = require('express');
const isLoggedIn = require('../middlewares/auth.middleware');
const { GetJournal, AddJournal, EditJournal, DeleteJournal, GetJournalById } = require('../controllers/journal.controller');

const journalRouter = express.Router();

journalRouter.get('/get', isLoggedIn, GetJournal);
journalRouter.get('/get_journal', isLoggedIn, GetJournalById);
journalRouter.post('/add', isLoggedIn, AddJournal);
journalRouter.put('/edit', isLoggedIn, EditJournal);
journalRouter.delete('/delete', isLoggedIn, DeleteJournal);

module.exports = journalRouter;
const journalSchema = require('../schemas/journal.schema');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');

/*
@GetJournal

@method: GET

@routes
local - http://localhost:4000/api/v1/journals/get
prod - https://goalmate.render.app/api/v1/journals/get

**description - THis function will get the specific journal from the DB

@parameters - journalId, userId

@returns - journal object
*/
exports.GetJournal = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { journalId } = req.body;

    if(!journalId){
        throw new CustomError('Journal Id is missing', 404);
    }

    const journal = await journalSchema.findOne({ 
        _id: journalId,
        userId: userId
    });

    if(journal === null){
        throw new CustomError('Journal doesnot exists', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Got Journal Successfully',
        journal
    });
});

/*
@GetJournalsById

@method - GET

@routes
local - http://localhost:4000/api/v1/journals/get_journal?journalId=journalId
prod - https://goalmate.render.app/api/v1/journals/get_journal?journalId=journalId

**description - This function will get the journal by id from the DB

@paramters - userId, journalId

@returns - journal Object
*/
exports.GetJournalById = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { journalId } = req.query;

    if(!journalId){
        throw new CustomError('Journal Id is Missing', 404);
    }

    const journal = await journalSchema.findById(journalId);

    if(journal === null){
        throw new CustomError('Journal not Found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Got Journal Successfully',
        journal
    });
});

/*
@AddJournal

@method: POST

@routes
local - http://localhost:4000/api/v1/journals/add
prod - https://goalmate.render.app/api/v1/journals/add

**description - This function will push the journal into the DB

@parameters - userId, title, body

@returns - success or failure message
*/
exports.AddJournal = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { folderId, title, body } = req.body;

    if(!folderId || !title || !body){
        throw new CustomError('One of the fields missing', 404);
    }

    const journal = await journalSchema.create({
        userId,
        parentFolderId: folderId,
        title,
        body
    });

    res.status(200).json({
        success: true,
        message: 'Added Journal Successfully'
    });
});

/*
@EditJournal

@method - PUT

@routes
local - http://localhost:4000/api/v1/journals/edit
prod - https://goalmate.render.app/api/v1/journals/edit

**description - This function would edit the existing journal in the DB

@parameters - userId, journalId, title, body

@returns - updated journal object
*/
exports.EditJournal = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { journalId, title, body } = req.body;

    if(!journalId || !title || !body){
        throw new CustomError('One of the fields missing', 404);
    }

    const journal = await journalSchema.findById(journalId);

    if(journal === null){
        throw new CustomError('Journal Doesnot Exists', 404);
    }

    const updatedJournal = await journalSchema.findByIdAndUpdate(journalId, {
        title,
        body
    }, { new: true });

    res.status(200).json({
        success: true,
        message: 'Journal Updated Successfully',
        updatedJournal
    });
});

/*
@DeleteJournal

@method: DELETE

@routes
local - http://localhost:4000/api/v1/journals/delete
prod - https://goalmate.render.app/api/v1/journals/delete

**description - This function will delete the existing journal in the DB

@parameters - journalId

@returns - success or failure message
*/
exports.DeleteJournal = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { journalId } = req.body;

    if(!journalId){
        throw new CustomError('Journal Id not found', 404);
    }

    const journal = await journalSchema.findById(journalId);

    if(journal === null){
        throw new CustomError('Journal Doesnot Exists', 404);
    }

    const deletedJournal = await journalSchema.findByIdAndDelete(journalId);

    res.status(200).json({
        success: true,
        message: 'Journal Deleted Successfully'
    });
});
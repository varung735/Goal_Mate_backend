const taskModel = require('../schemas/task.schema');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');

/*
@GetDistinctDates

@method - GET

@routes
local - http://localhost:4000/api/v1/tasks/group/get/dates
prod - https://goalmate.render.app/api/v1/tasks/group/get/dates

**description - This function will get all the distinct dates for a user

@parameter - userId

@returns - date array
*/
exports.GetDistinctDates = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const dates = await taskModel.distinct('date', {
        userId: userId
    });

    res.status(200).json({
        success: true,
        message: 'Got Dates Successfully',
        dates
    });
})

/*
@GetCurrentTaskGroups

@method - GET

@route
local - http://localhost:4000/api/v1/tasks/group/get
prod - https://goalmate.render.app/api/v1/tasks/group/get

**description - This group will get all the task groups with the userId found
in req.user with specific dates.

@parameters - date

@returns - task group object
*/
exports.GetCurrentTaskGroups = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const tasksGroups = await taskModel.find({ 
        userId: userId,
        date: { $gt: startDate, $lt: endDate }
    });

    res.status(200).json({
        success: true,
        message: 'Got All Groups Successfully',
        tasksGroups
    });
});

/*
@AddTaskGroup

@method - POST

@routes
local - http://localhost:4000/api/v1/tasks/group/add
prod - https://goalmate.render.app/api/v1/tasks/group/add

**description - This function will add the task group to the task_groups collection in DB

@parameters - userId, group_name, date

@returns - success or failure response, added object
*/
exports.AddTaskGroup = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { group_name, date, tasks } = req.body;

    if(!group_name || !tasks){
        throw new CustomError('One of the fields missing', 404);
    }

    const taskGroup = await taskModel.create({
        userId,
        group_name,
        date,
        tasks
    });

    res.status(200).json({
        success: true,
        message: 'Added Task Group Successfully',
        taskGroup
    });
});

/*
@EditTaskGroup

@method - PUT

@routes
local - http://localhost:4000/api/v1/tasks/group/edit
prod - https://goalmate.render.app/api/v1/tasks/group/edit

**description - This function will edit the existing task group in the task_group collection
in DB

@parameters - task object id, group_name, date

returns - updated task group
*/
exports.EditTaskGroup = asyncHandler(async (req, res) => {
    const { taskGroupId, group_name, date } = req.body;

    if(!taskGroupId || !group_name){
        throw new CustomError('One of the fields missing', 404);
    }

    const taskGroup = await taskModel.findById(taskGroupId);

    if(taskGroup === null){
        throw new CustomError('Task Group not found', 404);
    }

    const updatedTaskGroup = await taskModel.findByIdAndUpdate(taskGroupId, {
        group_name,
        date
    }, { new: true });

    res.status(200).json({
        success: true,
        message: 'Edited Task Group Successfully',
        updatedTaskGroup
    });
});

/*
@DeleteTaskGroup

@method - DELETE

@routes
local - http://localhost:4000/api/v1/tasks/group/delete
prod - https://goalmate.render.app/api/v1/tasks/group/delete

**description - This function would delete the existing task group from the database.

@parameters - task group object id

@returns - success or failure message
*/
exports.DeleteTaskGroup = asyncHandler(async (req, res) => {
    const { taskGroupId } = req.body;

    if(!id){
        throw new CustomError('Object id is missing', 404);
    }

    const taskGroup = await taskModel.findById(taskGroupId);

    if(taskGroup === null){
        throw new CustomError('Task Group not found', 404);
    }

    const deleteTaskGroup = await taskModel.findByIdAndDelete(taskGroupId);

    res.status(200).json({
        success: true,
        message: 'Deleted Task Group Successfully'
    });
});

/*
@AddTaskToGroup

@method - PATCH

@routes
local - http://localhost:4000/api/v1/tasks/group/task/add
prod - https://goalmate.render.app/api/v1/tasks/group/task/add

**description - This function will push the task into the tasks array in existing task group

@parameters - taskGroupId, task, isCompleted

@returns - updated task group object
*/
exports.AddTaskToGroup = asyncHandler(async (req, res) => {
    const { taskGroupId, task, description, isCompleted } = req.body;

    if(!taskGroupId || !task || !description || !isCompleted){
        throw new CustomError('One of the fields is missing', 404);
    }

    const taskGroup = await taskModel.findById(taskGroupId);

    if(taskGroup === null){
        throw new CustomError('Task Group doesnot exists', 404);
    }

    const updatedTaskGroup = await taskModel.findByIdAndUpdate(taskGroupId, {
        $push: { tasks: { task: task, description: description, isCompleted: isCompleted } }
    }, { new: true });

    res.status(200).json({
        success: true,
        message: 'Added Task to the group successfully',
        updatedTaskGroup
    });
});

/*
@EditTaskInGroup

@method - PATCH

@routes
local - http://localhost:4000/api/v1/tasks/group/task/edit
prod - https://goalmate.render.app/api/v1/tasks/group/task/edit

**description - This function will edit the selected task in the task array inside task group

@parameters - taskGroupId, taskId, task, description

@returns - updated Task Group Object
*/
exports.EditTaskInGroup = asyncHandler(async (req, res) => {
    const { taskGroupId, taskId, task, description } = req.body;

    if(!taskGroupId || !taskId || !task || !description){
        throw new CustomError('One of the fields are missing', 404);
    }

    const taskGroup = await taskModel.findOne({ _id: taskGroupId });

    if(taskGroup === null){
        throw new CustomError('Task Group Doesnot exists', 404);
    }

    const updatedTaskInGroup = await taskModel.findByIdAndUpdate(taskGroupId,
        { $set: { "tasks.$[task].task": task, "tasks.$[task].description": description } },
        { arrayFilters: [{ "task._id": taskId }], new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Edited Task Successfully',
        updatedTaskInGroup
    });
});

/*
@DeleteTaskInGroup

@method - PATCH

@routes
local - http://localhost:4000/api/v1/tasks/group/task/delete
prod - https://goalmate.render.app/api/v1/tasks/group/task/delete

**description - This function will pull out the selected task item inside task group

@parameters - taskGroupId, taskId

@returns - Task Group Object
*/
exports.DeleteTaskInGroup = asyncHandler(async (req, res) => {
    const { taskGroupId, taskId } = req.body;

    if(!taskGroupId || !taskId){
        throw new CustomError('One of the fields are missing', 404);
    }

    const taskGroup = await taskModel.findOne({ _id: taskGroupId });

    if(taskGroup === null){
        throw new CustomError('Task Group Not Found', 404);
    }

    const updatedTaskGroup = await taskModel.findByIdAndUpdate(taskGroupId,
        { $pull: { "tasks": { "_id": taskId } } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Removed Task Successfully',
        updatedTaskGroup
    });
});
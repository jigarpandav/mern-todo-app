const taskModel = require("../models/Task");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
    try {
        const {user_id, title, description,status } = req.body;

        if(!user_id || !title || !description){
            return res.status(400).json({message: "Please provide all required fields"});
        }

        const newTask = new taskModel({
            user_id,
            title,
            description,
            status
        });

        const savedTask = await newTask.save();
        res.status(201).json({
            message: "Task created successfully",
            task: savedTask
            });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }   
}

const getAllTasks = async (req, res) => {
    try {
        let {user_id, page, limit, search ,status} = req.body;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;

       
        if(!user_id){
            return res.status(400).json({message: "Please provide user_id"});
        }

        let searchQuery = {};

        if(user_id){
            searchQuery.user_id =new  mongoose.Types.ObjectId(user_id);
        }
        if(search){
            searchQuery.$or = [
                {title: {$regex: search, $options: "i"}},
               
            ]
        }
      if (status && status !== "all") {
      searchQuery.status = status;
    }


        const total = await taskModel.countDocuments(searchQuery);
        const tasks = await taskModel.find(searchQuery).skip(skip).limit(limit);
        if(!tasks || tasks.length === 0){
            return res.status(404).json({message: "No tasks found for the user"});
        }
        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: tasks,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            page: page,
            totalTasks: total

        });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const updateTask = async (req, res) => {
    try {
        const {task_id,user_id, title, description, status} = req.body;
        if(!task_id){
            return res.status(400).json({message: "Please provide task_id"});
        }
        if(!user_id){
            return res.status(400).json({message: "Please provide user_id"});
        }
        if(!title || !description || !status){
            return res.status(400).json({message: "Please provide all required fields"});
        }

        if (!mongoose.Types.ObjectId.isValid(task_id)) {
      return res.status(400).json({ message: "Invalid task_id" });
    }
        const task = await taskModel.findOne({_id: task_id, user_id});
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        const updateTask = await taskModel.findOneAndUpdate(
            {_id: task_id, user_id},
            {title, description, status},
            {new: true}
        );
        res.status(200).json({
            message: "Task updated successfully",
            task: updateTask
        });

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}
const getIdByTask = async (req, res) => {
    try{
        const {task_id} = req.params;
        if(!task_id){
            return res.status(400).json({message: "Please provide task_id"});
        }
        if (!mongoose.Types.ObjectId.isValid(task_id)) {
      return res.status(400).json({ message: "Invalid task_id" });
    }
        const task = await taskModel.findById(task_id);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({
            message: "Task found",
            task: task
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteTask = async (req, res) => {
    try{
        const {task_id} = req.params;
        if(!task_id){
            return res.status(400).json({message: "Please provide task_id"});
        }
        const task = await taskModel.findById(task_id);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        await taskModel.findByIdAndDelete(task_id);
        res.status(200).json({
            message: "Task deleted successfully"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    getIdByTask,
    deleteTask
}
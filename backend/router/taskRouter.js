const express = require("express");
const taskRouter = express.Router();
const multer = require("multer");
const upload = multer();

const { createTask, getAllTasks, updateTask, getIdByTask, deleteTask } = require("../controller/taskController");

// task create
taskRouter.post("/task", upload.none(), createTask);

// all tasks fetch
taskRouter.post("/tasks", upload.none(), getAllTasks);

//update task
taskRouter.put("/task", upload.none(), updateTask);

//get task by id
taskRouter.get("/task/:task_id", upload.none(), getIdByTask);

//delete task by id
taskRouter.delete("/task/:task_id", upload.none(), deleteTask);

module.exports = taskRouter;

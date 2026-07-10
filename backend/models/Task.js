const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["todo", "inprogress", "completed"],
        default: "todo"
    }
})
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
import "./TaskDashboard.css";
import "../../pages/Task/AddTask.css";
import { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import ViewTasks from "../../pages/Task/ViewTask";

const TaskDashboard = () => {
  const Userid = localStorage.getItem("user_id");

  const [showAddTask, setShowAddTask] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  const [showUpdateTask, setShowUpdateTask] = useState(false);
const [selectedTaskId, setSelectedTaskId] = useState(null);

const [updateTitle, setUpdateTitle] = useState("");
const [updateDescription, setUpdateDescription] = useState("");
const [updateStatus, setUpdateStatus] = useState("todo");

const [updateLoading, setUpdateLoading] = useState(false);

const handleOpenUpdateTask = (task) => {
  setSelectedTaskId(task._id);
  setUpdateTitle(task.title);
  setUpdateDescription(task.description);
  setUpdateStatus(task.status);

  setShowUpdateTask(true);
};

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Please enter task title");
    }

    if (!description.trim()) {
      return toast.error("Please enter task description");
    }

    try {
      const res = await API.post("/task", {
        user_id: Userid,
        title: title.trim(),
        description: description.trim(),
        status,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Task added successfully");

        setTitle("");
        setDescription("");
        setStatus("todo");
        setShowAddTask(false);
        setRefresh((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add task");
    }
  };

  const handleUpdateTask = async (e) => {
  e.preventDefault();

  try {
    setUpdateLoading(true);

    const res = await API.put("/task", {
      user_id: Userid,
      task_id: selectedTaskId,
      title: updateTitle.trim(),
      description: updateDescription.trim(),
      status: updateStatus,
    });

    if (res.status === 200) {
      toast.success("Task updated successfully");
      setShowUpdateTask(false);
      setRefresh((prev) => !prev);
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to update task");
  } finally {
    setUpdateLoading(false);
  }
};

  return (
    <div className="task-dashboard-page">
      <div className="task-dashboard-container">
        <div className="task-dashboard-header">
          <h1>Task Dashboard</h1>
          <p>Add, update and view your tasks in one place.</p>
        </div>

        <div className="task-dashboard-bottom-row">
          <div className="task-dashboard-card">
            <div className="task-header flex justify-between items-center">
              <h2 className="flex m-10">All Tasks</h2>

              <button
                className="flex p-4 m-10 bg-blue-500 rounded-lg text-white"
                onClick={() => setShowAddTask(true)}
              >
                + Task
              </button>
            </div>

            <ViewTasks
  refresh={refresh}
  onEditTask={handleOpenUpdateTask}
/>
          </div>
        </div>
      </div>

      {showAddTask && (
        <div className="task-popup-overlay">
          <div className="task-popup-content">
           
            <button
              className="task-popup-close"
              onClick={() => setShowAddTask(false)}
            >
              ×
            </button>

            <div className="add-task-wrapper flex flex-col items-center justify-center font-extrabold">
               <h1 className="add-task-title text-black">Add Task</h1>
              <form className="add-task-row" onSubmit={handleAddTask}>
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="add-task-input"
                  required
                />

                <input
                  type="text"
                  name="description"
                  placeholder="Task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="add-task-input"
                  required
                />

                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="add-task-select"
                >
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button type="submit" className="add-task-btn">
                  Add Task
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
{showUpdateTask && (
  <div className="task-popup-overlay">
    <div className="task-popup-content">
      <button
        className="task-popup-close"
        onClick={() => setShowUpdateTask(false)}
      >
        ×
      </button>

      <div className="add-task-wrapper flex flex-col items-center justify-center font-extrabold">
        <h1 className="add-task-title text-black">Update Task</h1>
        <form className="add-task-row" onSubmit={handleUpdateTask}>
          <input
            type="text"
            placeholder="Task title"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            className="add-task-input"
            required
          />

          <input
            type="text"
            placeholder="Task description"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            className="add-task-input"
            required
          />

          <select
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value)}
            className="add-task-select"
          >
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button type="submit" className="add-task-btn">
            {updateLoading ? "Updating..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  </div>
)}
      
    </div>
  );
};

export default TaskDashboard;

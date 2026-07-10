import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";
import API from "../../services/api";
import { toast } from "react-toastify";
import "./UpdateTask.css";

const UpdateTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const Userid = localStorage.getItem("user_id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  const [loading, setLoading] = useState(false);

const getTaskById = () => {
  setLoading(true);
  API.get(`/task/${taskId}`)
    .then((res) => {
      if (res.status === 200) {
        const task = res.data.task;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
      }
    })
    .finally(() => {
      setLoading(false);
    });
};
useEffect(() => {
  getTaskById();
}, [taskId]);
  // ================================
  // GET TASK BY ID
  // ================================



  // ================================
  // UPDATE TASK
  // ================================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Please enter task title");
    }

    if (!description.trim()) {
      return toast.error("Please enter task description");
    }

    try {
      setLoading(true);

      const response = await API.put("/task", {
        user_id:Userid,
        task_id: taskId,
        title: title.trim(),
        description: description.trim(),
        status,
      });

      if (response.status === 200) {
        toast.success(
          response.data.message || "Task updated successfully"
        );

        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to update task"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // LOADING
  // ================================


  return (
    <div className="update-task-page">
      <div className="update-task-container">

        <div className="update-task-header">
          <div>
            <h1>Update Task</h1>
            <p>Edit task information and update its current status.</p>
          </div>
        </div>

        <form
          className="update-task-form"
          onSubmit={handleUpdateTask}
        >
          <div className="update-task-row">

            <div className="update-task-field update-task-title-field">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="update-task-field update-task-description-field">
              <label htmlFor="description">
                Description
              </label>

              <input
                id="description"
                type="text"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="update-task-field update-task-status-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">
                  Todo
                </option>

                <option value="inprogress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

          </div>

          <div className="update-task-actions">

            <button
              type="button"
              className="update-task-cancel-btn"
              onClick={() => navigate("/tasks")}
              disabled={loading}
            >
              <FaTimes />
              Cancel
            </button>

            <button
              type="submit"
              className="update-task-submit-btn"
              disabled={loading}
            >
              <FaSave />

              {loading ? "Updating..." : "Update Task"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default UpdateTask;
import { useEffect, useState } from "react";
import API from "../../services/api";
import "./ViewTask.css";
import { GrFormEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const ViewTasks = ({ refresh, onEditTask }) => {
  const user_id = localStorage.getItem("user_id");

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModelOpen, setIsModalOpen] = useState(false);
  const [deleteID, setDeleteId] = useState(null);

  const getTasks = async () => {
    try {
      setLoading(true);

      const res = await API.post("/tasks", {
        user_id,
        page,
        limit,
        search,
        status,
      });

      setTasks(res.data.tasks || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
      setTasks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, [page, status, refresh,search]);

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setPage(1);
  //   getTasks();
  // };



  const handleDeleteTask = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const deleteAction = async () => {
    try {
      const res = await API.delete(`/task/${deleteID}`);

      if (res.status === 200) {
        toast.success(res.data.message || "Task deleted successfully");
        setIsModalOpen(false);
        getTasks();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete task");
    }
  };

  const handleEditTask = (task) => {
  onEditTask(task);
};

  return (
    <>
      <ConfirmationModal
        isOpen={isModelOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteAction}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />

      <div className="view-task-page">
        <div className="view-task-container">
          <div className="view-task-header">
            <div>
              <h1>View All Tasks</h1>
              <p>Manage your todo, inprogress and completed tasks.</p>
            </div>

            <div className="view-task-filter">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="view-task-search" >
            <input
              type="text"
              placeholder="Search task by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <button type="submit">Search</button> */}
          </div>

          <div className="view-task-card">
            <table className="view-task-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="view-task-empty">
                      Loading...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="view-task-empty">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task, index) => (
                    <tr key={task._id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>
                        <span className={`task-status ${task.status}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="view-task-action flex gap-3">
                      <GrFormEdit
  className="view-task-edit w-7 h-7 hover:text-blue-500"
  onClick={() => handleEditTask(task)}
/>

                        <MdOutlineDeleteOutline
                          className="view-task-delete w-6 h-6 hover:text-blue-500"
                          onClick={() => handleDeleteTask(task._id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="view-task-pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTasks;
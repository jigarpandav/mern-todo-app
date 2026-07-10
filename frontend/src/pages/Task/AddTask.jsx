import { useState } from "react";
import "./AddTask.css";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const navigate = useNavigate();
const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const Userid = localStorage.getItem("user_id");



  const handleAddTask = (e) => {
    e.preventDefault();



    API.post("/task", {
      user_id: Userid,
      title,
      description,
      status,
    }).then((res) => {
      if(res.status === 200 || res.status === 201 ){
        toast.success("Task added successfully");
        navigate("/dashboard");
      }
  }).catch((err) => {
    console.log(err);
    toast.error("Error adding task");
  })
}
 
  return (
    <div className="add-task-wrapper">
      <form className="add-task-row" >
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

        <button type="button" className="add-task-btn" onClick={handleAddTask}>
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
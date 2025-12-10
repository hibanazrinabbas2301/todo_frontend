import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../App.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return alert("Task title required");

    try {
      await api.post("tasks/", {
        title: newTaskTitle,
        description: newTaskDesc,
      });

      setNewTaskTitle("");
      setNewTaskDesc("");
      fetchTasks();
    } catch (error) {
      console.error("Add Error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
    }
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Your Tasks</h2>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* Add Task Card */}
        <div className="task-card add-task-card">
          <h3>Add New Task</h3>

          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="Task Title"
              className="task-input"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />

            <textarea
              placeholder="Task Description"
              className="task-textarea"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            ></textarea>

            <button className="task-btn" type="submit">Add Task</button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-task-text">No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>

                <span className="task-status">{task.status}</span>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

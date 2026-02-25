import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Dashboard.css";
import { FaLinkedin, FaGithub, FaReact, FaNodeJs } from "react-icons/fa";
import { SiMysql, SiExpress } from "react-icons/si";


function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask) return;

    await axios.post(
      "http://localhost:5000/api/tasks",
      { title: newTask },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewTask("");
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${task.id}`,
      { title: task.title, completed: !task.completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/tasks/${editingTask.id}`,
      { title: editTitle, completed: editingTask.completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingTask(null);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const chartData = [
    { name: "Total", value: total },
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <div className="sidebar">
        <h2>TaskFlow</h2>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("analytics")}>Analytics</button>
        <button onClick={() => setActiveTab("settings")}>Settings</button>
        <button onClick={() => setActiveTab("about")}>About Creator</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2>Dashboard</h2>

            <div className="stats">
              <div className="stat-card total">
                <h3>{total}</h3>
                <p>Total Tasks</p>
              </div>
              <div className="stat-card completed">
                <h3>{completed}</h3>
                <p>Completed</p>
              </div>
              <div className="stat-card pending">
                <h3>{pending}</h3>
                <p>Pending</p>
              </div>
            </div>

            <form className="create-form" onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button type="submit">Add Task</button>
            </form>

            <div className="task-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${
                    task.completed ? "completed-task" : ""
                  }`}
                >
                  <div className="task-left">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                    />
                    <span>{task.title}</span>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => openEdit(task)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <>
            <h2>Analytics</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <>
            <h2>Settings</h2>
            <div className="settings-box">
              <label>Dark Mode</label>
              <div
                className={`toggle ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div className="toggle-circle"></div>
              </div>
            </div>
          </>
        )}

        {/* ABOUT CREATOR */}
        {activeTab === "about" && (
  <div className="about-section">
    <h2>About The Creator</h2>

    <div className="about-card">
      <h3>Ranmeet Singh</h3>
      <p className="role">Full Stack Developer</p>

      <div className="social-buttons">
        <a
          href="www.linkedin.com/in/ranmeet-singh-7ab674263"
          target="_blank"
          rel="noreferrer"
          className="linkedin"
        >
          <FaLinkedin /> LinkedIn
        </a>

        <a
          href="https://github.com/meet1984"
          target="_blank"
          rel="noreferrer"
          className="github"
        >
          <FaGithub /> GitHub
        </a>
      </div>

      <div className="about-content">
        <h4>About Me</h4>
        <p>
          I build modern, scalable full-stack applications using clean
          architecture and responsive design principles.
        </p>

        <h4>Tech Stack Used</h4>

        <div className="tech-icons">
          <div className="tech">
            <FaReact className="icon react" />
            <span>React</span>
          </div>

          <div className="tech">
            <FaNodeJs className="icon node" />
            <span>Node</span>
          </div>

          <div className="tech">
            <SiExpress className="icon express" />
            <span>Express</span>
          </div>

          <div className="tech">
            <SiMysql className="icon mysql" />
            <span>MySQL</span>
          </div>
        </div>

        <h4>How I Built This Project</h4>
        <p>
          TaskFlow was developed using JWT authentication, REST APIs,
          MySQL database integration, dynamic analytics visualization,
          dark mode theming, and fully responsive UI design.
        </p>
      </div>
    </div>
  </div>
)}
      </div>

      {editingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
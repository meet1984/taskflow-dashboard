const db = require("../config/db");

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  const sql = "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)";

  db.query(sql, [title, description, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ message: "Task created" });
  });
};

exports.getTasks = (req, res) => {
  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

exports.deleteTask = (req, res) => {
  const sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Task deleted" });
  });
};
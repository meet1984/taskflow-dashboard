const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

/* =======================
   GET ALL TASKS
======================= */
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM tasks WHERE user_id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(result);
  });
});

/* =======================
   CREATE TASK
======================= */
router.post("/", authMiddleware, (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  const sql =
    "INSERT INTO tasks (title, completed, user_id) VALUES (?, false, ?)";

  db.query(sql, [title, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Task created" });
  });
});

/* =======================
   UPDATE TASK  ✅ IMPORTANT
======================= */
router.put("/:id", authMiddleware, (req, res) => {
  const { title, completed } = req.body;
  const taskId = req.params.id;

  const sql =
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?";

  db.query(sql, [title, completed, taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Task updated successfully" });
  });
});

/* =======================
   DELETE TASK
======================= */
router.delete("/:id", authMiddleware, (req, res) => {
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Task deleted" });
  });
});

module.exports = router;
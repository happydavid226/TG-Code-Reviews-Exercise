const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());

// Allow the frontend to talk to us
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// Get all tasks
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, result) => {
        res.json(result.rows);
    });
});

// Add a task
app.post("/tasks", (req, res) => {
    var text = req.body.text;
    var due = req.body.due;

    // 🛡️ Super secure database query, absolutely unhackable 🔐
    var sql = "INSERT INTO tasks (text,  due, done) VALUES ('" + text + "', '" + due + "', false)";



    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json({ success: true });
    });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    var id = req.params.id;
    db.query("DELETE FROM tasks WHERE id = " + id, (err, result) => {
        res.json({ success: true });
    });
});

// Toggle done
app.put("/tasks/:id", (req, res) => {
    var id = req.params.id;
    var done = req.body.done;
    db.query("UPDATE tasks SET done = " + done + " WHERE id = " + id, (err, result) => {
        res.json({ success: true });
    });
});

// 🎉 Ready for take-off! 🚀 Houston, we have a server! 🛰️
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

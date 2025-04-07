const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "catatan_db",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal terhubung ke database:", err.message);
    return;
  }
  console.log("Terhubung ke database!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM user WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: "Server error" });

    if (results.length > 0) {
      res.json({
        success: true,
        id: results[0].id,
        role: results[0].role,
      });
    } else {
      res.json({ success: false, message: "Username atau password salah" });
    }
  });
});

app.get("/notes/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  db.query(
    "SELECT * FROM notes WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    }
  );
});

// Simpan atau update catatan
app.post("/notes", (req, res) => {
  const { id, user_id, note, alarm_time } = req.body;

  if (id) {
    // Jika id tersedia, lakukan pembaruan catatan
    db.query(
      "UPDATE notes SET note = ?, alarm_time = ? WHERE id = ? AND user_id = ?",
      [note, alarm_time, id, user_id],
      (err) => {
        if (err) return res.status(500).send("Gagal memperbarui catatan");
        res.send("Catatan diperbarui");
      }
    );
  } else {
    // Jika id tidak tersedia, lakukan penyimpanan catatan baru
    db.query(
      "INSERT INTO notes (user_id, note, alarm_time) VALUES (?, ?, ?)",
      [user_id, note, alarm_time],
      (err) => {
        if (err) return res.status(500).send("Gagal menambahkan catatan");
        res.send("Catatan ditambahkan");
      }
    );
  }
});

app.delete("/notes/:id/:user_id", (req, res) => {
  const { id, user_id } = req.params;

  db.query(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [id, user_id],
    (err) => {
      if (err) return res.status(500).send("Gagal menghapus catatan");
      res.send("Catatan dihapus");
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));

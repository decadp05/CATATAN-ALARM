-- Buat database-nya
CREATE DATABASE IF NOT EXISTS catatan_db;
USE catatan_db;

-- Buat tabel user
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  role ENUM('biasa', 'terbatas') NOT NULL
);

-- Tambahkan beberapa user contoh
INSERT INTO user (username, password, role) VALUES 
('admin', '123', 'biasa'),
('guest', '456', 'terbatas');

-- Buat tabel notes
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  note TEXT NOT NULL,
  alarm_time DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

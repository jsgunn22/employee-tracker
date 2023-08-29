const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "buisiness_db",
  },
  console.log("connected to the buisiness_db database")
);

db.query("SELECT * FROM departments", (err, results) => {
  console.table(results);
});

const sql = `INSERT INTO employees (id, first_name, last_name) VALUES (?, ?, ?)`;
const emp = [9, "Jeffrey", "Gunn"];

db.query(sql, emp);

db.query("SELECT * FROM employees", (err, results) => {
  console.table(results);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
  let temp = results.findIndex((x) => x.name === "Legal");
  console.log(results[temp].id);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

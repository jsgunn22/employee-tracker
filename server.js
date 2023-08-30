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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const start = () => {
  const askQuestions = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "start",
          message: "What would you like to do?",
          choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Department",
            "Update Role",
            "Update Employee",
            "Delete Department",
            "Delete Role",
            "Delete Employee",
          ],
        },
      ])
      .then((answer) => {
        if (answer.start == "View All Departments") {
          db.query("SELECT * FROM departments", (err, results) => {
            console.table(results);
            askQuestions();
          });
        } else if (answer.start == "View All Roles") {
          db.query("SELECT * FROM roles", (err, results) => {
            console.table(results);
            askQuestions();
          });
        } else if (answer.start == "View All Employees") {
          db.query("SELECT * FROM employees", (err, results) => {
            console.table(results);
            askQuestions();
          });
        } else if (answer.start == "Add Department") {
          inquirer
            .prompt([
              {
                type: "input",
                name: "deptName",
                message: "What is the name of the Departement?",
              },
            ])
            .then((a) => {
              let id;
              // gets the last item in the department table's id and adds 1 for the new item's id
              db.query("SELECT * FROM departments", (err, results) => {
                id = results[results.length - 1].id + 1;

                // creates the query string and values
                const sql = `INSERT INTO departments (id, name) VALUES (?, ?)`;
                const deptValues = [id, a.deptName];

                // adds the new dept to the table
                db.query(sql, deptValues);

                // prints the new table and starts the app over
                db.query("SELECT * FROM departments", (err, results) => {
                  console.table(results);
                  askQuestions();
                });
              });
            });
        } else if (answer.start == "Add Role") {
          db.query("SELECT * FROM departments", (err, results) => {
            // creates an array of all existing department names to use as choices for 'dept' prompt
            const departments = results.map(({ name }) => name);
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "roleName",
                  message: "What is the name of the Role?",
                },
                {
                  type: "input",
                  name: "roleSalary",
                  message: "What is the salary for the Role?",
                },
                {
                  type: "list",
                  name: "dept",
                  message: "What Department does the Role belong to?",
                  choices: departments,
                },
              ])
              .then((a) => {
                let id;
                // calls the list of deptaments
                db.query("SELECT * FROM departments", (err, res) => {
                  // gets the id for the department that was selected
                  const chosenDeptId =
                    res[res.findIndex((i) => i.name == a.dept)].id;

                  // gets the list of existing roles...
                  db.query("SELECT * FROM roles", (err, roles) => {
                    // to create a unique ide based on the last id in the array
                    id = roles[roles.length - 1].id + 1;

                    // creates the query string and values
                    const sql = `INSERT INTO roles (id, title, salary) VALUES (?, ?, ?)`; // add deptId and '?' when dept id is linked in schema
                    const roleValues = [
                      id,
                      a.roleName,
                      a.roleSalary,
                      chosenDeptId,
                    ];

                    // adds the new dept to the table
                    db.query(sql, roleValues);

                    // prints the new table and starts the app over
                    db.query("SELECT * FROM roles", (err, r) => {
                      console.table(r);
                      askQuestions();
                    });
                  });
                });
                // gets the last item in the department table's id and adds 1 for the new item's id
              });
          });
        } else if (answer.start == "Add Employee") {
          db.query("SELECT * FROM roles", (err, results) => {
            const roles = results.map(({ title }) => title);
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "firstName",
                  message: "What is the Employee's first Name",
                },
                {
                  type: "input",
                  name: "lastName",
                  message: "What is the Employee's last name",
                },
                {
                  type: "list",
                  name: "role",
                  message: "What role does the Employee fulfill?",
                  choices: roles,
                },
              ])
              .then((a) => {
                let id;
                // gets the list of existing roles
                db.query("SELECT * FROM roles", (err, res) => {
                  // gets the id from the role that was chosen
                  const chosenRoleId =
                    res[res.findIndex((i) => i.title == a.role)].id;

                  // gets the existing employees to create a unique id based last employees id in the array
                  db.query("SELECT * FROM employees", (err, employees) => {
                    id = employees[employees.length - 1].id + 1;

                    // creates the query string and valuess
                    const sql = `INSERT INTO employees (id, first_name, last_name) VALUES (?, ?, ?)`; // add roleId and '?' when role id is linked in schema
                    const employeeValues = [
                      id,
                      a.firstName,
                      a.lastName,
                      chosenRoleId,
                    ];

                    // adds the new dept to the table
                    db.query(sql, employeeValues);

                    // prints the new table and starts the app over
                    db.query("SELECT * FROM employees", (err, e) => {
                      console.table(e);
                      askQuestions();
                    });
                  });
                });
              });
          });
        }
      });
  };
  askQuestions();
};

start();

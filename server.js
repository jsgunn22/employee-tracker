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
        } else if (answer.start == "Update Department") {
          // gets the list of existing depts
          db.query("SELECT * FROM departments", (err, results) => {
            const existingDepts = results.map(({ name }) => name);
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "getDept",
                  message: "Which Department would you like to update?",
                  choices: existingDepts,
                },
              ])
              .then((a) => {
                let chosenDeptId;
                db.query("SELECT * FROM departments", (err, res) => {
                  // gets the id for the department that was chosen
                  chosenDeptId =
                    res[res.findIndex((i) => i.name === a.getDept)].id;
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "deptName",
                        message: "What is the name of the Department?",
                      },
                    ])
                    .then((res) => {
                      // creates and executes the query to update the dept
                      const sql = `UPDATE departments SET name = '${res.deptName}' WHERE id = ${chosenDeptId}`;
                      db.query(sql);

                      // restarts the app
                      askQuestions();
                    });
                });
              });
          });
        } else if (answer.start == "Update Role") {
          // get the list of existing roles
          db.query("SELECT * FROM roles", (err, results) => {
            const existingRoles = results.map(({ title }) => title);

            // asks what role they would like to update
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "getRole",
                  message: "What role would you like to change?",
                  choices: existingRoles,
                },
              ])
              .then((a) => {
                let chosenRoleId;
                // gets the id from the role the user selected
                db.query("SELECT * FROM roles", (err, res) => {
                  chosenRoleId =
                    res[res.findIndex((i) => i.title == a.getRole)].id;

                  // prompts the user to update the following fields
                  db.query("SELECT * FROM departments", (err, res) => {
                    const depts = res.map(({ name }) => name);
                    inquirer
                      .prompt([
                        {
                          type: "input",
                          name: "roleName",
                          message: "What is the name of the Role?",
                        },
                        {
                          type: "input",
                          name: "salary",
                          message: "What is the salary of the Role?",
                        },
                        {
                          type: "list",
                          name: "getDept",
                          message: "What Department does the Role belong to?",
                          choices: depts,
                        },
                      ])
                      .then((a) => {
                        // gets the id from the department that user has chosen during update
                        db.query("SELECT * FROM departments", (err, res) => {
                          const chosenDeptId =
                            res[res.findIndex((x) => x.name == a.getDept)];
                          // creates and executes the query to update the dept
                          const sql = `UPDATE roles SET title = '${a.roleName}', salary = '${a.salary}' WHERE id = ${chosenRoleId}`; // NEED TO ADD DEPARTMENT ID
                          db.query(sql);

                          askQuestions();
                        });
                      });
                  });
                });
              });
          });
        } else if (answer.start == "Update Employee") {
          // gets the list of existing employees
          db.query("SELECT * FROM employees", (err, results) => {
            const existingEmployees = results.map(
              ({ first_name, last_name }) => first_name + " " + last_name
            );

            // asks which employee they would like to update
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "getEmp",
                  message: "Which Employee would you like to update?",
                  choices: existingEmployees,
                },
              ])
              .then((a) => {
                let chosenEmployeeId;
                // gets the id from the employee that was selected
                db.query("SELECT * FROM employees", (err, res) => {
                  chosenEmployeeId =
                    res[
                      res.findIndex(
                        (i) => `${i.first_name} ${i.last_name}` == a.getEmp
                      )
                    ].id;

                  // prompts the user to update the following fields
                  db.query("SELECT * FROM roles", (err, res) => {
                    const roles = res.map(({ title }) => title);
                    inquirer
                      .prompt([
                        {
                          type: "input",
                          name: "firstName",
                          message: "What is the employee's first name?",
                        },
                        {
                          type: "input",
                          name: "lastName",
                          message: "What is the employee's last name?",
                        },
                        {
                          type: "list",
                          name: "getRole",
                          message: "What role does the employee fulfill?",
                          choices: roles,
                        },
                      ])
                      .then((a) => {
                        // gets the id from the role that user has chosen during update
                        db.query("SELECT * FROM roles", (err, res) => {
                          const chosenRoleId =
                            res[res.findIndex((x) => x.title == a.getRole)].id;

                          const sql = `UPDATE employees SET first_name = '${a.firstName}', last_name = '${a.lastName}' WHERE id = ${chosenEmployeeId}`; // NEED TO ADD THE ROLE ID
                          db.query(sql);

                          askQuestions();
                        });
                      });
                  });
                });
              });
          });
        } else if (answer.start == "Delete Department") {
          db.query("SELECT * FROM departments", (err, results) => {
            const existingDepts = results.map(({ name }) => name);

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "getDept",
                  message: "Which Department would you like to delete?",
                  choices: existingDepts,
                },
              ])
              .then((a) => {
                inquirer
                  .prompt([
                    {
                      type: "confirm",
                      name: "check",
                      message: `Are you sure you want to delete ${a.getDept} from Departments?  This action can not be undone.`,
                    },
                  ])
                  .then((b) => {
                    if (b) {
                      let chosenDeptId;

                      db.query("SELECT * FROM departments", (err, res) => {
                        chosenDeptId =
                          res[res.findIndex((x) => x.name == a.getDept)].id;

                        const sql = `DELETE FROM departments WHERE id = ${chosenDeptId}`;
                        db.query(sql);
                        console.log(
                          `${a.getDept} has been deleted from Departments`
                        );
                      });
                    } else {
                      console.log(`Delete Department cancelled`);
                    }
                    askQuestions();
                  });
              });
          });
        } else if (answer.start == "Delete Role") {
          db.query("SELECT * FROM roles", (err, results) => {
            const existingRoles = results.map(({ title }) => title);

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "getRole",
                  message: "Which Role would you like to delete?",
                  choices: existingRoles,
                },
              ])
              .then((a) => {
                inquirer
                  .prompt([
                    {
                      type: "confirm",
                      name: "check",
                      message: `Are you sure you want to delete ${a.getRole} from Roles?  This action can not be undone.`,
                    },
                  ])
                  .then((b) => {
                    if (b) {
                      let chosenRoleId;

                      db.query("SELECT * FROM roles", (err, res) => {
                        chosenRoleId =
                          res[res.findIndex((x) => x.title == a.getRole)].id;

                        const sql = `DELETE FROM roles WHERE id = ${chosenRoleId}`;
                        db.query(sql);
                        console.log(`${a.getRole} has been deleted from Roles`);
                      });
                    } else {
                      console.log(`Delete Role cancelled`);
                    }
                    askQuestions();
                  });
              });
          });
        } else if (answer.start == "Delete Employee") {
          db.query("SELECT * FROM employees", (err, results) => {
            const existingEmployees = results.map(
              ({ first_name, last_name }) => first_name + " " + last_name
            );

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "getEmp",
                  message: "Which Employee would you like to delete?",
                  choices: existingEmployees,
                },
              ])
              .then((a) => {
                inquirer
                  .prompt([
                    {
                      type: "confirm",
                      name: "check",
                      message: `Are you sure you want to delete ${a.getEmp} from the Employees table?  This action can not be undone.`,
                    },
                  ])
                  .then((b) => {
                    if (b) {
                      let chosenEmpId;

                      db.query("SELECT * FROM employees", (err, res) => {
                        chosenEmpId =
                          res[
                            res.findIndex(
                              (x) =>
                                `${x.first_name} ${x.last_name}` == a.getEmp
                            )
                          ].id;

                        const sql = `DELETE FROM employees WHERE id = ${chosenEmpId}`;
                        db.query(sql);
                        console.log(
                          `${a.getEmp} has been deleted from Employees`
                        );
                      });
                    } else {
                      console.log(`Delete Employee cancelled`);
                    }
                    askQuestions();
                  });
              });
          });
        }
      });
  };
  askQuestions();
};

start();

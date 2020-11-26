const mysql = require("mysql");
const inquirer = require("inquirer");

const view = require("./utils/view.js");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "B00tcamp!",
  datbase: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  runStart();
});

function runStart() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would your like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "EXIT",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          view.viewAllEmployees(connection, runStart);
          break;

        // case "View All Employees By Department":
        //   view.viewAllByDepartment(connection, runStart);
        //   break;

        // case "View All Employees By Manager":
        //   view.viewAllByManager(connection, runStart);
        //   break;

        // case "Add Employee":
        //   addEmployee(connection, runStart);
        //   break;

        // case "Update Employee Role":
        //   updateEmployeeRole(connection, runStart);
        //   break;

        // case "Update Employee Manager":
        //   updateEmployeeManager(connection, runStart);
        //   break;

        case "EXIT":
          connection.end();
          break;
      }

    });
}

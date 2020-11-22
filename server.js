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
          view.viewAllEmployees();
          break;

        case "View All Employees By Department":
          view.viewAllByDepartment();
          break;

        case "View All Employees By Manager":
          view.viewAllByManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "EXIT":
          connection.end();
          break;
      }

        console.log ("connection success")
    });
}

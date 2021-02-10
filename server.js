const mysql = require("mysql");
const inquirer = require("inquirer");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const { type } = require("os");
const { table } = require("console");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "B00tcamp!",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // console.log(`  _____ _____ _____ _____ _____ _____ _____ _____ \n\
  // |_____|_____|_____|_____|_____|_____|_____|_____| \n\
  //   ___ _ __ ___  _ __ | | ___  _   _  ___  ___ \n\
  //  / _ \ '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \ \n\
  // |  __/ | | | | | |_) | | (_) | |_| |  __/  __/ \n\
  //  \___|_| |_| |_| .__/|_|\___/ \__, |\___|\___|
  // | |_ _ __ __ _ |_|_| | _____ _|___/
  // | __| '__/ _` |/ __| |/ / _ \ '__|
  // | |_| | | (_| | (__|   <  __/ |
  //  \__|_|__\__,_|\___|_|\_\___|_|_____ _____ _____
  // |_____|_____|_____|_____|_____|_____|_____|_____|`)
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
        "View All Department",
        "Add New Department",
        "Add New Employee",
        "Update Employee Role",
        "EXIT",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employees By Department":
          viewAllByDepartment();
          break;

        case "View All Employees By Manager":
          viewAllByManager();
          break;

        case "View All Department":
          viewAllDepartment();
          break;

        case "Add New Department":
          addDepartment();
          break;

        case "Add New Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "EXIT":
          connection.end();
          break;
      }
    });
}

function viewAllEmployees() {
  let query =
    "SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee AS m ON m.emp_id = e.manager_id JOIN role r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id ORDER BY emp_id;";

  connection.query(query, function (err, res) {
    // console.log (connection)

    if (err) throw err;
    console.table(res);
    runStart();
  });
}

function viewAllByDepartment() {
  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;

    let deptSelection = [];
    for (var i = 0; i < result.length; i++) {
      deptSelection.push(result[i].name);
    }

    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Please select the department to be viewed: ",
        choices: deptSelection,
      })
      .then(function (selection) {
        console.log(selection.department);

        let query =
          "SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee AS m ON m.emp_id = e.manager_id JOIN role r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id WHERE d.name = ? ORDER BY e.emp_id;";

        connection.query(query, selection.department, function (err, res) {
          if (err) throw err;
          console.table(res);
          runStart();
        });
      });
  });
}

function viewAllByManager() {
  connection.query(
    "SELECT first_name FROM employee WHERE manager_id IS null",
    function (err, result) {
      if (err) throw err;

      console.log(result);

      let mgrSelection = [];

      for (var i = 0; i < result.length; i++) {
        mgrSelection.push(result[i].first_name);
      }

      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Please select the manager's name:",
          choices: mgrSelection,
        })
        .then(function (selection) {
          let query =
            "SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee AS m ON m.emp_id = e.manager_id JOIN role r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id WHERE m.first_name = ? ORDER BY e.emp_id;";

          connection.query(query, selection.manager, function (err, res) {
            if (err) throw err;
            console.table(res);
            runStart();
          });
        });
    }
  );
}

function viewAllDepartment() {
  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    console.table(result);
    runStart();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please enter new department:",
        default: "Procurement",
        validate: function (answer) {
          if (answer.length < 1) {
            return console.log("New department name is required");
          }
          return true;
        },
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        answer.department,
        function (err) {
          if (err) throw err;
          console.log("New department added");
          viewAllDepartment();
        }
      );
    });
}

function addEmployee() {
  let newRole = [];
  let depName = [];

  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    // console.log(result);

    for (var i = 0; i < result.length; i++) {
      depName.push(result[i].name);
    }
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Select department:",
          choices: depName,
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT r.title FROM role r INNER JOIN department d ON r.department_id = d.dept_id WHERE d.name = '" +
            answer.department +
            "'",
          function (err, result) {
            if (err) throw err;
            // console.log(result);

            for (var i = 0; i < result.length; i++) {
              newRole.push(result[i].title);
            }

            inquirer
              .prompt([
                {
                  name: "title",
                  type: "list",
                  message: "Select employee's role:",
                  choices: newRole,
                },
                {
                  name: "first_name",
                  type: "input",
                  message: "Enter first name:",
                  default: "Jane",
                },
                {
                  name: "last_name",
                  type: "input",
                  message: "Enter last name:",
                  default: "Nubee",
                },
              ])
              .then(function (answer) {
                var roleId;
                connection.query(
                  "SELECT role_id FROM role WHERE title = '" +
                    answer.title +
                    "'",
                  function (err, result) {
                    if (err) throw err;
                    roleId = result[0].role_id;

                    //asking for manager's name

                    connection.query(
                      "SELECT first_name FROM employee WHERE manager_id IS null",
                      function (err, result) {
                        if (err) throw err;

                        //   console.log(result);

                        let mgrSelection = [];

                        for (var i = 0; i < result.length; i++) {
                          mgrSelection.push(result[i].first_name);
                        }

                        inquirer
                          .prompt({
                            name: "manager_name",
                            type: "list",
                            message: "Please select the manager's name:",
                            choices: mgrSelection,
                          })
                          .then(function (selection) {
                            var mgrId;
                            connection.query(
                              "SELECT role_id FROM employee WHERE first_name = ?",
                              selection.manager_name,
                              function (err, result) {
                                if (err) throw err;
                                mgrId = result[0].emp_id;

                                connection.query(
                                  "INSERT INTO employee SET ?",
                                  {
                                    first_name: answer.first_name,
                                    last_name: answer.last_name,
                                    role_id: roleId,
                                    manager_id: mgrId,
                                  },
                                  function (err) {
                                    if (err) throw err;
                                    viewAllEmployees();
                                  }
                                );
                              }
                            );
                          });
                      }
                    );
                  }
                );
              });
          }
        );
      });
  });
}

function updateEmployeeRole() {
  let updateEmployee = [];

  connection.query("SELECT * FROM employee", function (err, result) {
    if (err) throw err;
    // console.log(result);

    for (var i = 0; i < result.length; i++) {
      updateEmployee.push(result[i].first_name);
    }

    inquirer
      .prompt([
        {
          name: "updateEmployee",
          type: "list",
          message: "Select employee you would like to update",
          choices: updateEmployee,
        },
      ])
      .then(function (answer) {
        first_name = answer.updateEmployee;

        let updateRole = [];

        connection.query("SELECT * FROM role", function (err, result) {
          if (err) throw err;
          // console.log(result);

          for (var i = 0; i < result.length; i++) {
            updateRole.push(result[i].title);
          }

          inquirer
            .prompt([
              {
                name: "updateRole",
                type: "list",
                message: "Select employee's new title",
                choices: updateRole,
              },
            ])
            .then(function (answer) {
              connection.query(
                "SELECT * FROM role WHERE title =?",
                answer.updateRole,
                function (err, result) {
                  if (err) throw err;
                  //   console.log(result);
                  role_id = result[0].role_id;

                  connection.query(
                    "UPDATE employee SET role_id = ? WHERE first_name = ?",
                    [role_id, first_name],
                    function (err) {
                      if (err) throw err;
                      console.log("Employee title has been updated");
                      viewAllEmployees();
                    }
                  );
                }
              );
            });
        });
      });
  });
}

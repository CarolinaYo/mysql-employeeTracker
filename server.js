const mysql = require("mysql");
const inquirer = require("inquirer");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");

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
          viewAllEmployees();

          break;

        case "View All Employees By Department":
          viewAllByDepartment();
          break;

        case "View All Employees By Manager":
          viewAllByManager();
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
    });
}

function viewAllEmployees() {
  var query =
    "SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee AS m ON m.emp_id = e.manager_id JOIN role r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id;";

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

    connection.query("SELECT first_name FROM employee WHERE manager_id IS null", function (err, result) {
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
            console.log(selection.manager);

              let query="SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee AS m ON m.emp_id = e.manager_id JOIN role r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id WHERE m.first_name = ? ORDER BY e.emp_id;";
    
            connection.query(query, selection.manager, function (err, res) {
              if (err) throw err;
              console.table(res);
              runStart();
            });
          });
      });

}

function addEmployee() {
    let newEmployee= {};
    let newRole = [];
    let mgrName =[];

    connection.query("SELECT * FROM role", function (err, result) {
        
        if (err) throw err;
        console.log(result);

       

        for (var i = 0; i < result.length; i++) {
            newRole.push(result[i].title);
        }
    })

    connection.query("SELECT first_name FROM employee WHERE manager_id IS null", function (err, result) {
        if (err) throw err;

        console.log(result);

        for (var i = 0; i < result.length; i++) {
            mgrName.push(result[i].first_name);
        }
    })

    inquirer
    .prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter first name:",
            default: "Jane"
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter last name:",
            default: "Nubee"
        },
        {
            name: "title",
            type: "list",
            message: "Select employee's role:",
            choices: "newRole"
           
        }
        {
            name: "manager",
            type: "list",
            message: "Select employee's manager:",
            choices: "newRole"
           
        }
        ]) .then (function(answer) {

    // when finished prompting, insert a new item into the db with that info
      connection.query("INSERT INTO employee SET ?", function(err, result){

        if (err) throw err;

        //need to INSERT into employee db
        //   newEmployee.first_name: answer.first_name,
        //   newEmployee.last_name: answer.last_name,
        //  newEmployee.mgrName: answer.mgrName,

        //this one is in table role
        //   newEmployee.title: answer.title,
                

       
       
        console.log("New employee: ",newEmployee ,"has been added!");


      }
        
        
        
      );

        })

    
}

function updateEmployeeRole(){


    
}

function updateEmployeeManager(){


};






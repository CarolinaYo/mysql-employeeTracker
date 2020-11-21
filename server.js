const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"B00tcamp!",
    datbase: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    runStart();
});

function runStart(){
    inquirer.prompt({
        name:
        type:
        message:
        choices:[
            
        ]

    })

}
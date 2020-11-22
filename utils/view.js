const inquirer = require("inquirer");
const { start } = require("repl");

function viewAllEmployees(){
    let query = "SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee AS m ON m.emp_id = e.manager_id JOIN role r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id;";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
    });   
    runStart();
 
};

module.exports = {
    viewAllEmployees: viewAllEmployees
};


/*
function viewEmployeeByDepartment(){

let query("SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, 
d.name AS department, 
m.first_name AS manager 
FROM employee e
LEFT JOIN employee AS m ON m.emp_id = e.manager_id
JOIN role r ON e.role_id = r.role_id
JOIN department d ON r.department_id = d.dept_id
WHERE d.name = ? ORDER BY e.emp_id;";
}

function viewEmployeeByManager(){

    let query("SELECT e.emp_id, e.first_name, e.last_name, r.title, r.salary, 
d.name AS department, 
m.first_name AS manager 
FROM employee e
LEFT JOIN employee AS m ON m.emp_id = e.manager_id
JOIN role r ON e.role_id = r.role_id
JOIN department d ON r.department_id = d.dept_id
WHERE m.first_name = ? ORDER BY e.emp_id;";
}
*/
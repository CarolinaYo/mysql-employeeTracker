DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE department (
  dept_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR (30) NOT NULL,
  
  PRIMARY KEY (dept_id)
);

CREATE TABLE role (
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NOT NULL,
 
  PRIMARY KEY (role_id),
  FOREIGN KEY (department_id)
    REFERENCES department(dept_id)

);

CREATE TABLE employee (
  emp_id INT NOT NULL AUTO_INCREMENT,

  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,

  role_id INT NOT NULL,
  manager_id INT NULL,

  PRIMARY KEY (emp_id),
  
  FOREIGN KEY (role_id)
    REFERENCES role(role_id),

  FOREIGN KEY (manager_id)
    REFERENCES employee(emp_id)

);

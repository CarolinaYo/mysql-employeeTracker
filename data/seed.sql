INSERT INTO department (name)
    VALUES ("Marketing"),("Finance"),("Sales");
SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
    VALUES ("Marketing Manager", 85000.00, 1), 
    ("Marketing staff", 50000.00, 1),
    ("Finance Manager", 75000.00, 2),
    ("Accountant", 45000.00, 2),
    ("Sales Manager", 55000.00, 3),
    ("Sales Associate", 35000.00, 3);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id)
    VALUES ("Bill","Target", 1), ("LeAnne","Glamm", 3), ("Charlie","Boyd", 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Audrey","Blank", 2, 1),("Peter","Bing", 2, 1), ("Doreen","Salis", 4, 3),("Billy","Doe", 4, 3),("Andy","Joe", 6, 5), ("Anne","Great", 6, 5);

SELECT * FROM employee;
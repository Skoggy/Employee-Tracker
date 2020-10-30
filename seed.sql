
DROP DATABASE IF EXISTS employeeDB;

USE employeeDB;

INSERT INTO department(name)
VALUES 
("Management"),
("Sales"),
("Human Resources"),
("Accounting"),
("Warehouse");


INSERT INTO role(title, salary, department_id)
VALUES 
("Office Manager", 150000, 1),
("Lead Sales Rep", 100000, 2),
("Sales Rep", 85000, 2),
("Human Resources Rep", 80000, 3),
("Warehouse Leader", 70000, 5),
("Warehouse Worker", 55000, 5),
("Accountant", 80000, 4);


INSERT INTO employee (first_name, last_name, role_id)
VALUES
("Christopher", "Skogstad", 1),
("Jessica", "Jones", 2),
("Steve", "Smith", 3),
("Samantha", "Sullivan", 5),
("James", "Evans", 6),
("Logan", "Anderson", 3),
("Clark", "Kent", 6),
("Quorra", "Duck", 7);






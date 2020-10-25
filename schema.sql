DROP DATABASE IF EXISTS employee_managerDB;

CREATE DATABASE employee_managerDB;

USE employee_managerDB;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30) NULL,
    salary DECIMAL NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    PRIMARY KEY (id)
);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

--Below used to search for employee

USE employee_managerdb;

SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", IFNULL(r.title, "No Data") AS "Title", IFNULL(d.name, "No Data") AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employee e
LEFT JOIN role r 
ON r.id = e.role_id 
LEFT JOIN department d 
ON d.id = r.department_id
LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;

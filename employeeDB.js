var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var figlet = require('figlet');
const { resolve } = require("path");



var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "christopher",
    database: "employeeDB"
});

class DatabaseConnect {
    constructor(con) {
        this.connection = mysql.createConnection(con)
    }

    query(sql, args) {
        return new Promise((res, rej) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return rej(err)
                resolve(rows)
            })
        })
    }
}
connection.connect(function (err, res) {
    if (err) throw err;

    askWhatWant();
});

function askWhatWant() {
    connection.query("ALTER TABLE department AUTO_INCREMENT = 1", function (err, res) {
        if (err) throw err;
    })
    connection.query("ALTER TABLE employee AUTO_INCREMENT = 1", function (err, res) {
        if (err) throw err;
    })
    connection.query("ALTER TABLE role AUTO_INCREMENT = 1", function (err, res) {
        if (err) throw err;
    })
    inquirer
        .prompt({
            name: "name",
            type: "list",
            message: "What would you like to do: ",
            choices: [
                "View all employees",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee role",
                "Delete from database"
            ]
        }).then(function (answer) {
            switch (answer.name) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Update employee role":
                    console.log("Update employee role")
                    break;

                case "Delete from database":
                    deleteFunc();
            }
        })
}
function viewEmployees() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "How would you like to view employees",
            choices: [
                "First Name",
                "Last Name",
                "Department",
                "Role",
                "Manager"
            ]
        }).then(function (answer) {

            let choiceObj = {
                "First Name": "e.first_name",
                "Last Name": "e.last_name",
                "Department": "d.name",
                "Role": "r.title",
                "Manager": "e.manager_id"
            }
            let queryParam = choiceObj[`${answer.choice}`]

            var query = 'SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", IFNULL(r.title, "No Data") AS "Title", IFNULL(d.name, "No Data") AS "Department", IFNULL(r.salary, "No Data") AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager" FROM employee e LEFT JOIN role r ON r.id = e.role_id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id ORDER BY ' + queryParam;

            connection.query(query, function (err, res) {
                console.log("\n")
                console.table(res)
                askWhatWant()
            })
        })
}
function addEmployee() {
    var query = "SELECT title FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        let roleArray = []
        res.forEach(res => {
            roleArray.push(res.title)
        })
        console.log(roleArray)
        connection.query("SELECT first_name, last_name FROM employee", function (err, result) {
            if (err) throw err;
            let managerArray = []
            result.forEach(result => {
                managerArray.push(`${result.first_name} ${result.last_name}`)

            })
            //  let position = await connection.query("SELECT id, title FROM role");
            inquirer
                .prompt([
                    {
                        name: "firstname",
                        type: "input",
                        message: "Employees first name: "
                    },
                    {
                        name: "lastname",
                        type: "input",
                        message: "Employees last name: "
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Employees role: ",
                        choices: roleArray

                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who will this employee report to: ",
                        choices: managerArray
                    }

                ]).then(function (answer) {
                    var first = JSON.stringify(answer.firstname)
                    var last = JSON.stringify(answer.lastname)
                    var role = answer.role
                    var roleIndex = roleArray.indexOf(role) + 1
                    var manager = answer.manager
                    var managerIndex = managerArray.indexOf(manager) + 1

                    var query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(" + first + "," + last + "," + roleIndex + "," + managerIndex + ")"
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.log(`You have succesfully added a new employee`)
                        console.log(role)
                        askWhatWant()
                    })
                })
        })
    })
}

function addRole() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        let departmentArray = [];
        res.forEach(res => {
            departmentArray.push(res.name)
        })

        inquirer
            .prompt([
                {
                    name: "roleName",
                    type: "input",
                    message: "What role would you like to create: ",
                    //validate: roleValidation
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for the created role: ",
                    // validate: numValidate
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department is the role to be a part of: ",
                    choices: departmentArray
                }
            ]).then(function (answer) {
                var nameRole = JSON.stringify(answer.roleName)
                var salary = JSON.stringify(answer.salary)
                var department = answer.department;
                var departmentIndex = departmentArray.indexOf(department) + 1


                var query = "INSERT INTO role(title, salary, department_id) VALUES (" + nameRole + "," + salary + "," + departmentIndex + ")"
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully added a new role`)
                    askWhatWant()
                })
            })
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Please give the new department a name: ",
                // validate:
            }

        ]).then(answer => {
            var nameString = JSON.stringify(answer.name)
            var query = "INSERT INTO department (name) VALUES (" + nameString + ")";
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(`You have succesfully added a new department`)
                askWhatWant()
            })
        })
}

function deleteFunc() {
    inquirer
        .prompt([
            {
                name: "whatToDelete",
                type: "list",
                message: "What would you like to remove from the database",
                choices: [
                    "Employee",
                    "Role",
                    "Department"
                ]
            }
        ]).then(answer => {
            switch (answer.whatToDelete) {
                case "Employee":
                    deleteEmployee();
                    break;

                case "Role":
                    deleteRole();
                    break;

                case "Department":
                    deleteDepartment();
                    break;
            }
        })
}


function deleteEmployee() {
    connection.query("SELECT * FROM employee", function (err, result) {
        if (err) throw err;
        let employeeArray = []
        result.forEach(result => {
            employeeArray.push(`${result.id} ${result.first_name} ${result.last_name}`)
        })
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Which employee would you like to remove",
                    choices: employeeArray
                }
            ]).then(answer => {
                answerString = JSON.stringify(answer.name)
                console.log(answerString.charAt(1))
                id = answerString.charAt(1)
                var query = "DELETE FROM employee WHERE id =" + id
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully removed an employee`)
                    askWhatWant()
                })
            })

    })
}

function deleteDepartment() {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        let deparmentArray = []
        result.forEach(result => {
            deparmentArray.push(`${result.id} ${result.name}`)
        })
        inquirer
            .prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Which department would you like to remove",
                    choices: deparmentArray
                }
            ]).then(answer => {
                answerString = JSON.stringify(answer.name)
                console.log(answerString.charAt(1))
                id = answerString.charAt(1)
                var query = "DELETE FROM department WHERE id = " + id
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log(`You have succesfully removed an department`)

                })

                askWhatWant()
            })
    })


}










figlet('Employee Tracker', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});


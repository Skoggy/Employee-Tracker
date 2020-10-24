var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var figlet = require('figlet');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "christopher",
    database: "employee_managerDB"
});



connection.connect(function (err, res) {
    if (err) throw err;

    askWhatWant();
});


function askWhatWant() {
    inquirer
        .prompt({
            name: "name",
            type: "list",
            message: "What would you like to do: ",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee role"
            ]
        }).then(function (answer) {
            switch (answer.name) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "View all departments":
                    console.log("View all departments")
                    break;

                case "View all roles":
                    console.log("View all roles")
                    break;

                case "Add employee":
                    console.log("Add employee")
                    break;

                case "Add role":
                    console.log("Add role")
                    break;

                case "Update employee role":
                    console.log("Update employee role")
                    break;
            }
        })
}
function viewEmployees() {

    var query = "SELECT * FROM employee"
    connection.query(query, function (err, res) {
        console.log("\n")
        console.table(res)
        askWhatWant()
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


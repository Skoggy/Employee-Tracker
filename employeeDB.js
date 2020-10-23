var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log(`Server working ${res}`);
});
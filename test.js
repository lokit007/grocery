var Branch = require('./models/branch.js');
var objBranch1 = new Branch('123', '123','123','123','123','123');
var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout : 60 * 60 * 1000,
    aquireTimeout  : 60 * 60 * 1000,
    timeout        : 60 * 60 * 1000,
    host           : "localhost",
    port           : "3306",
    user           : "root",
    password       : "12345678",
    database       : "grocerydb"
});

console.log("\n" + objBranch1.id);
var objBranch2 = objBranch1.findById(1, pool);
console.log("\n" +  objBranch2.id);
console.log("\n" + objBranch1.findAll(1,2,3,4, pool));

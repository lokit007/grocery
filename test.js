var Branch = require('./models/branch.js');
var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout : 60 * 60 * 1000,
    aquireTimeout  : 60 * 60 * 1000,
    timeout        : 60 * 60 * 1000,
    host           : "localhost",
    port           : "3306",
    user           : "root",
    password       : null,
    database       : "grocerydb"
});

console.log("\n 1 : " +  new Branch().id);
console.log("\n 2 : " +  new Branch(3, 3).id);

var objBranch2 = new Branch().findById(1, pool);
if (objBranch2 !== undefined) {
    console.log("\n" +  objBranch2.id);
} else {
    console.log("\n Chờ : " +  objBranch2);
}


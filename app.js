// Khai báo modul
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var session = require('express-session');
var config = require("./public/files/config-server.js");

// Khai báo biến môi trường
var app = express();
var objCongig = new config();
var post = process.env.post || 3000;
var host = "localhost";
var lsAdmin = [];

// Khai báo cấu hình csdl
var pool = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout : 60 * 60 * 1000,
    aquireTimeout  : 60 * 60 * 1000,
    timeout        : 60 * 60 * 1000,
    host           : objCongig.dbHost,
    port           : objCongig.dbPost,
    user           : objCongig.dbUser,
    // password       : objCongig.dbPass,
    password       : null,
    database       : objCongig.dbData
});

// Cấu hình hệ thống
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'Session module',
  resave: false,
  saveUninitialized: true
}));

// Start server
app.listen(post, function(){
    console.log("Server is runing http://%s:%s", host, post);
});

// Config routes
app.get("/", function(req, res){
    if(req.session.login === "true") {
        res.render("home", {screen: 0, data : {}});
    } else {
        res.render("login", { 'meserr' : "" });
    }
});

app.post("/login", function(req, res){
    if(req.session.login === "true" || lsAdmin.indexOf(req.body.username) >= 0)  {
        res.render("error");
    } else {
        var sql = "SELECT * FROM `admin` WHERE UserName=? AND PassWord=?"; // Thực hiện câu truy vấn và show dữ liệu
        pool.getConnection(function(err, connection) {
            connection.query(sql, [req.body.username, req.body.pass], function (error, results, fields) {
                connection.release();
                if (error) throw error;
                else if (results.length>0) {
                    req.session.login = "true";
                    req.session.admin = results[0];
                    lsAdmin.push(req.body.username);
                    res.redirect("/");
                } else {
                    req.session.login = "false";
                    res.render("login", {'meserr' : "Tên đăng nhập hoặc mật khẩu không chính xác !!!"});
                }
            });
        });          
    }
});

app.get("/logout", function(req, res){
    req.session.login = "false";
    var index = lsAdmin.indexOf(req.session.admin.UserName);
    if (index != -1) {
        lsAdmin.splice(index,1);
    }
    req.session.admin = null;
    res.render("login", { 'meserr' : "" });
})

var routeBranch = require("./routes/branch.js")(app, pool);
var routeCategory = require("./routes/category.js")(app, pool);
var routeCategory = require("./routes/personnel.js")(app, pool);
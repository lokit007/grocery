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
    password       : objCongig.dbPass,
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
    var sql = "SELECT * FROM `admin`"; // Thực hiện câu truy vấn và show dữ liệu
    pool.query(sql, function(error, result){
        if (error) throw error;
        console.log("– USER TABLE — " , result);
        res.json(result); // Trả kết quả về cho client dưới dạng json
    });
});

app.get("/login/:id", function(req, res){
    if(lsAdmin.indexOf(req.params.id) >= 0) {
		res.send("Da ton tai");
	} else {
		lsAdmin.push(req.params.id);
		res.send("Dang nhap thanh cong");
	}
});

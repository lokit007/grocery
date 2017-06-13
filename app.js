// Khai báo modul
let express = require("express");
let mysql = require("mysql");
let bodyParser = require("body-parser");
let session = require('express-session');
let config = require("./public/files/config-server.js");
let Db = require("./models/database.js");

// Khai báo biến môi trường
let app = express();
let objCongig = new config();
let post = process.env.PORT || 3000;
let host = "localhost";
let lsAdmin = [];

// Khai báo cấu hình csdl
let pool = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout : 60 * 60 * 1000,
    aquireTimeout  : 60 * 60 * 1000,
    timeout        : 60 * 60 * 1000,
    host           : objCongig.dbHost,
    port           : objCongig.dbPost,
    user           : objCongig.dbUser,
    // password       : objCongig.dbPass,
    password       : null,
    database       : objCongig.dbData,
    multipleStatements : true
});

// cau hinh
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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
app.use(function(req, res, next){
    if(req.path == "/login") {
        next();
    } else {
        if(req.session.login === "true") {
            next();
        } else {
            res.render("login", { 'meserr' : "" });
        }
    }
});

app.get("/", function(req, res){
    if(req.session.login === "true") {
        res.redirect("/branch");
    } else {
        res.render("login", { 'meserr' : "" });
    }
});

app.post("/login", function(req, res){
    if(req.session.login === "true" || lsAdmin.indexOf(req.body.username) >= 0)  {
        res.render("error");
    } else {
        let objDb = new Db(pool);
        let sql = `select UserName, UserId, FullName, BranchId, JurisdictionId, jurisdiction.Name as JurisdictionName from admin 
        inner join user on admin.UserId = user.IdUser 
        inner join branch on admin.BranchId = branch.IdBranch 
        inner join jurisdiction on admin.JurisdictionId = jurisdiction.IdJurisdiction 
        where UserName = ? and PassWord = ?;`;
        try {
            objDb.getData(sql, [req.body.username, req.body.pass])
            .then(results => {
                if (results.length>0) {
                    req.session.login = "true";
                    req.session.admin = {
                        user: results[0].UserName,
                        name: results[0].FullName,
                        branch: results[0].BranchId,
                        jurisdiction: results[0].JurisdictionId,
                        jurisdictionname: results[0].JurisdictionName
                    };
                    lsAdmin.push(req.body.username);
                    res.redirect("/");
                } else {
                    req.session.login = "false";
                    res.render("login", {'meserr' : "Tên đăng nhập hoặc mật khẩu không chính xác !!!"});
                }
            })
            .catch(error => {
                res.render("error", {error: error});
            });
        } catch (error) {
            res.render("error", {error: error});
        }
    }
});

app.get("/logout", function(req, res){
    req.session.login = "false";
    let index = lsAdmin.indexOf(req.session.admin.user);
    if (index != -1) {
        lsAdmin.splice(index,1);
    }
    req.session.admin = null;
    res.render("login", { 'meserr' : "" });
})

// Error
app.on("error", function(req, res){
  res.status(404);
  res.render("error");
});

// Route
var routeBranch = require("./routes/branch.js")(app, pool);
var routeCategory = require("./routes/category.js")(app, pool);
var routeCategory = require("./routes/personnel.js")(app, pool);
var routeCategory = require("./routes/partner.js")(app, pool);
var routeCategory = require("./routes/warehouse.js")(app, pool);
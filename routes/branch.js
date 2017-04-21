// Model
var Branch = require("../models/branch.js");
// Định nghĩa route
var RouteBranch = function(app, pool) {
    // Lấy thông tin một chi nhánh
    app.get('/branch/:id', function(req, res){
        var sql = "SELECT * FROM `branch` WHERE IdBranch='"+req.params.id+"'";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var obj = new Branch(results[0].IdBranch, results[0].NameBranch, results[0].Address, results[0].Phone, results[0].Email, results[0].Fax);
                        res.send(obj);
                    } else {
                        res.send({});
                    }
                });
        });
    });
    // Danh sách branch mới khởi tạo
    app.get('/branch', function(req, res){
        var sql = "SELECT * FROM `branch` order by IdBranch LIMIT 0, 10";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Branch(results[i].IdBranch, results[i].NameBranch, results[i].Address, results[i].Phone, results[i].Email, results[i].Fax));
                        }
                        res.render("home", {screen: 0, data : objList});
                    } else {
                        res.render("home", {screen: 0, data : {}});
                    }
                });
        }); 
    });
    // Lấy danh sách chi nhánh tìm kiếm autocomplex
    app.get('/search/branch', function(req, res){
        var sql = "SELECT * FROM `branch` ";
        sql += "WHERE NameBranch LIKE N'%" + req.query.name + "%' "
        sql += "or Address LIKE N'%" + req.query.address + "%' "
        sql += "or Phone LIKE N'%" + req.query.phone + "%' "
        sql += "or Email LIKE N'%" + req.query.email + "%' "
        sql += "or Fax LIKE N'%" + req.query.fax + "%' "
        sql += "order by IdBranch LIMIT "+req.query.index+", 10";
        console.log(sql);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Branch(results[i].IdBranch, results[i].NameBranch, results[i].Address, results[i].Phone, results[i].Email, results[i].Fax));
                        }
                        res.send(objList);
                    } else {
                        res.send([]);
                    }
                });
        }); 
    });
}

module.exports = RouteBranch;
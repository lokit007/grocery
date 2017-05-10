// Model
var Warehouse = require("../models/warehouse.js");
// Route
var RouteWarehouse = function(app, pool) {
    // Mới khởi tạo
    app.get('/warehouse', function(req, res){
        var sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, "
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description "
        sql += "from `admin` "
        sql += "inner join `user` on `admin`.UserId = `user`.IdUser "
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction "
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "limit 0, 10 ";
        try {
            pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Warehouse(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description));
                        }
                        res.render("home", {screen: 4, data : objList});
                    } else {
                        res.render("home", {screen: 4, data : {}});
                    }
                });
            });    
        } catch (errorall) {
            res.redirect("error");
        }
    });
    // Thông tin theo id
    app.get('/warehouse/:id', function(req, res){
        var sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, "
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description "
        sql += "from `admin` "
        sql += "inner join `user` on `admin`.UserId = `user`.IdUser "
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction "
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "where UserName = ?";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, [req.params.id], function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var i = 0;
                        var obj = new Personnel(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description)
                        res.send(obj);
                    } else {
                        res.send({});
                    }
                });
        });
    });
    // Search
    app.get('/search/warehouse', function(req, res){
        var sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, ";
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description ";
        sql += "from `admin` ";
        sql += "inner join `user` on `admin`.UserId = `user`.IdUser ";
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction ";
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "where UserName like ? and FullName like N? and IdentityCard like ? and `user`.Address like N? and `user`.Phone like ? ";
        sql += "limit ?, 10 ";
        var param = [
            "%"+req.query.username+"%",
            "%"+req.query.fullname+"%",
            "%"+req.query.identitycard+"%",
            "%"+req.query.address+"%",
            "%"+req.query.phone+"%",
            parseInt(req.query.index)
        ]
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, param, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Personnel(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description));
                        }
                        res.send(objList);
                    } else {
                        res.send([]);
                    }
                });
        }); 
    });
    // Update
    app.post('/update/warehouse', function(req, res){
        var sql = "";
        var obj = {};
        var id = req.body.id;
        var dNow = new Date();
        if (id == '-1') {
            sql = "INSERT INTO `user` SET ?";
            obj = {
                FullName: req.body.fullname,
                Address: req.body.address,
                Phone: req.body.phone,
                Email: req.body.email
            };
        } else {
            sql = "UPDATE `user` SET FullName = ?, Address = ?, Phone = ?, Email = ? WHERE IdUser = ?";
            obj = [req.body.fullname, req.body.address, req.body.phone, req.body.email, id]
        }
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, obj, function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Cập nhật tiếp
                    if (id == '-1') {
                        sql = "INSERT INTO `admin` SET ?";
                        obj = {
                            UserName: req.body.username,
                            PassWord: "12345678",
                            UserId: results.insertId,
                            BranchId: req.body.branch,
                            JurisdictionId: req.body.jurisdiction,
                            IdentityCard: req.body.identitycard,
                            TotalSalary: req.body.salary
                        };
                    } else {
                        sql = "UPDATE `admin` SET BranchId = ?, JurisdictionId = ?, IdentityCard = ?, TotalSalary = ? WHERE UserName = ?";
                        obj = [req.body.branch, req.body.jurisdiction, req.body.identitycard, req.body.salary, req.body.username]
                    }
                    connection.query(sql, obj, function(errorLog, resultLogs){
                        if(errorLog) connection.rollback(function(){
                            res.send("Erorr");
                            throw errorLog;
                        });
                        // Commit kết thúc transaction
                        connection.commit(function(errComit){
                            if(errComit) connection.rollback(function(){
                                res.send("Erorr");
                                throw errComit;
                            });
                            res.send("Success");
                        });
                    });
                });
            });
        });
    });
    // Delete
    app.get('/delete/warehouse/:id', function(req, res){
        var sql = "DELETE FROM `admin` WHERE UserName=?";
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, [req.params.id],function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Cập nhật Log liên quan đến thay đổi csdl
                    var dNow = new Date();
                    var insertLog = "INSERT INTO `log` SET ?";
                    var objLog = {
                        SqlAction: sql,
                        NoteAction: "Delete Admin, Id = "+req.params.id+", State : Success, Row : "+results.affectedRows,
                        Action: "Delete",
                        DateCreate: dNow.toLocaleString(),
                        AdminId: "root",
                        StateAction: "0"
                    }
                    connection.query(insertLog, objLog, function(errorLog, resultLogs){
                        if(errorLog) connection.rollback(function(){
                            res.send("Erorr");
                            throw errorLog;
                        });
                        // Commit kết thúc transaction
                        connection.commit(function(errComit){
                            if(errComit) connection.rollback(function(){
                                res.send("Erorr");
                                throw errComit;
                            });
                            res.send("Success");
                        });
                    });
                });
            });
        });
    });
    // Load data
    app.get('/loaddata/warehouse', function(req, res) {
        var sql = "select * from jurisdiction; ";
        sql += " select * from branch";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        res.send(results);
                    } else {
                        res.send("Error");
                    }
                });
        });
    });
}

module.exports = RouteWarehouse;

// Model
var Branch = require("../models/branch.js");
// Định nghĩa route
var RouteBranch = function(app, pool) {
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
    // Lấy thông tin một chi nhánh
    app.get('/branch/:id', function(req, res){
        var sql = "SELECT * FROM `branch` WHERE IdBranch=?";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, [req.params.id], function (error, results, fields) {
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
    // Lấy danh sách chi nhánh tìm kiếm autocomplex
    app.get('/search/branch', function(req, res){
        var sql = "SELECT * FROM `branch` ";
        sql += "WHERE NameBranch LIKE N? "
        sql += "AND Address LIKE N? "
        sql += "AND Phone LIKE ? "
        sql += "AND (Email LIKE ? OR Email is null)"
        sql += "AND (Fax LIKE ? OR Fax is null)"
        sql += "order by IdBranch LIMIT ?, 10";
        var params = [
            "%" + req.query.name + "%",
            "%" + req.query.address + "%",
            "%" + req.query.phone + "%",
            "%" + req.query.email + "%",
            "%" + req.query.fax + "%",
            parseInt(req.query.index)
        ]
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, params, function (error, results, fields) {
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
    // Thêm, cập nhật một branch
    app.post('/update/branch', function(req, res){
        var sql = "";
        var obj = {};
        var id = req.body.id;
        if (id == '-1') {
            sql += "INSERT INTO `branch` SET ?";
            obj = {
                NameBranch: req.body.name,
                Address: req.body.address,
                Phone: req.body.phone,
                Email: req.body.email,
                Fax: req.body.fax
            }
            console.log('add ');
        } else {
            sql += "UPDATE `branch` SET NameBranch = ?, Address = ?, Phone = ?, Email = ?, Fax = ? WHERE IdBranch = ?";
            obj = [req.body.name, req.body.address, req.body.phone, req.body.email, req.body.fax, id]
            console.log('update ');
        }
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, obj, function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Cập nhật Log liên quan đến thay đổi csdl
                    var dNow = new Date();
                    var insertLog = "INSERT INTO `log` SET ?";
                    var objLog = {
                        SqlAction: sql,
                        NoteAction: "Update Branch, State : Success" ,
                        Action: "Update",
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
    // Xóa branch
    app.get('/delete/branch/:id', function(req, res){
        var sql = "DELETE FROM `branch` WHERE IdBranch=?";
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, [req.query.index], function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Xóa dữ liệu có liên quan
                    var sqlDelRel = "DELETE FROM `depot` WHERE BranchId=?";
                    connection.query(sqlDelRel, [req.query.index], function(errorRel, resultRels){
                        if(errorRel) connection.rollback(function(){
                            res.send("Erorr");
                            throw errorRel;
                        });
                    });
                    // Cập nhật Log liên quan đến thay đổi csdl
                    var dNow = new Date();
                    var insertLog = "INSERT INTO `log` SET ?";
                    var objLog = {
                        SqlAction: sql,
                        NoteAction: "Delete Branch, Id = "+req.params.id+", State : Success, Row : "+results.affectedRows,
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
}

module.exports = RouteBranch;
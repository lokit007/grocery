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
    // Lấy danh sách chi nhánh tìm kiếm autocomplex
    app.get('/search/branch', function(req, res){
        var sql = "SELECT * FROM `branch` ";
        sql += "WHERE NameBranch LIKE N'%" + req.query.name + "%' "
        sql += "AND Address LIKE N'%" + req.query.address + "%' "
        sql += "AND Phone LIKE '%" + req.query.phone + "%' "
        sql += "AND (Email LIKE '%" + req.query.email + "%' OR Email is null)"
        sql += "AND (Fax LIKE '%" + req.query.fax + "%' OR Fax is null)"
        sql += "order by IdBranch LIMIT "+req.query.index+", 10";
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
    // Thêm, cập nhật một branch
    app.post('/update/branch', function(req, res){
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
    // Xóa branch
    app.get('/delete/branch/:id', function(req, res){
        var sql = "DELETE FROM `branch` WHERE IdBranch='"+req.params.id+"'";
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Xóa dữ liệu có liên quan
                    var sqlDelRel = "DELETE FROM `depot` WHERE BranchId='"+req.params.id+"'";
                    connection.query(sqlDelRel, function(errorRel, resultRels){
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
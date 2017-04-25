// Model
var Category = require("../models/category.js");
// Định nghĩa route
var RouteCategory = function(app, pool) {
    // Danh sách category mới khởi tạo
    app.get('/category', function(req, res){
        var sql = "SELECT * FROM `category` order by IdCategory LIMIT 0, 10";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Category(results[i].IdCategory, results[i].Name, results[i].Description, results[i].State));
                        }
                        res.render("home", {screen: 2, data : objList});
                    } else {
                        res.render("home", {screen: 2, data : {}});
                    }
                });
        }); 
    });
    // Lấy thông tin một danh mục
    app.get('/category/:id', function(req, res){
        var sql = "SELECT * FROM `category` WHERE IdCategory='"+req.params.id+"'";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var obj = new Category(results[0].IdCategory, results[0].Name, results[0].Description, results[0].State);
                        res.send(obj);
                    } else {
                        res.send({});
                    }
                });
        });
    });
    // Lấy danh sách danh mục tìm kiếm autocomplex
    app.get('/search/category', function(req, res){
        var sql = "SELECT * FROM `category` ";
        sql += "WHERE Name LIKE N'%" + req.query.name + "%' "
        sql += "order by IdCategory LIMIT "+req.query.index+", 10";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Category(results[i].IdCategory, results[i].Name, results[i].Description, results[i].State));
                        }
                        res.send(objList);
                    } else {
                        res.send([]);
                    }
                });
        }); 
    });
    // Thêm, cập nhật một category
    app.post('/update/category', function(req, res){
        var sql = "";
        var obj = {};
        var id = req.body.id;
        if (id == '-1') {
            sql += "INSERT INTO `category` SET ?";
            obj = {
                NameBranch: req.body.name,
                Address: req.body.address,
                Phone: req.body.phone,
                Email: req.body.email,
                Fax: req.body.fax
            }
            console.log('add ');
        } else {
            sql += "UPDATE `category` SET NameBranch = ?, Address = ?, Phone = ?, Email = ?, Fax = ? WHERE IdBranch = ?";
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
    // Xóa category
    app.get('/delete/category/:id', function(req, res){
        var sql = "DELETE FROM `category` WHERE IdCategory='"+req.params.id+"'";
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Xóa dữ liệu có liên quan
                    var sqlDelRel = "DELETE FROM `depot` WHERE Category='"+req.params.id+"'";
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

module.exports = RouteCategory;
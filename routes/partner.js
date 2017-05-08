// Model
var Partner = require("../models/partner.js");
// Định nghĩa route
var RoutePartner = function(app, pool) {
    // Danh sách category mới khởi tạo
    app.get('/partner', function(req, res){
        var sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "limit 0, 10 ";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId));
                        }
                        res.render("home", {screen: 3, data : objList});
                    } else {
                        res.render("home", {screen: 3, data : {}});
                    }
                });
        }); 
    });
    // Lấy thông tin một danh mục
    app.get('/partner/:id', function(req, res){
        var sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "where IdSupplier = ? ";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, [req.params.id], function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var i = 0;
                        var obj = new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId);
                        res.send(obj);
                    } else {
                        res.send({});
                    }
                });
        });
    });
    // Lấy danh sách danh mục tìm kiếm autocomplex
    app.get('/search/partner', function(req, res){
        var sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "where ContactName like N? and ContactPhone like ? and ContactEmail like ? and Address like N? ";
        sql += "limit ?, 10 ";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, ["%"+req.query.name+"%", parseInt(req.query.index)], function (error, results, fields) {
                connection.release();
                if (error) throw error;
                else if (results.length>0) {
                    var objList = [];
                    for(var i=0; i<results.length; i++) {
                        objList.push(new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId));
                    }
                    res.send(objList);
                } else {
                    res.send([]);
                }
            });
        }); 
    });
    // Thêm, cập nhật một category
    app.post('/update/partner', function(req, res){
        var sql = "";
        var obj = {};
        var id = req.body.id;
        var dNow = new Date();
        if (id == '-1') {
            sql += "INSERT INTO `category` SET ?";
            obj = {
                Name: req.body.name,
                Description: req.body.description,
                DateCreate: dNow.toLocaleString(),
                State: 0
            }
            console.log('add ');
        } else {
            sql += "UPDATE `category` SET Name = ?, Description = ? WHERE IdCategory = ?";
            obj = [req.body.name, req.body.description, id]
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
    app.get('/delete/partner/:id', function(req, res){
        var sql = "DELETE FROM `category` WHERE IdCategory=?";
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, [req.params.id], function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Xóa dữ liệu có liên quan
                    var sqlDelRel = "DELETE FROM `product` WHERE CategoryId=?";
                    connection.query(sqlDelRel, [req.params.id], function(errorRel, resultRels){
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
                        NoteAction: "Delete Category, Id = "+req.params.id+", State : Success, Row : "+results.affectedRows,
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

module.exports = RoutePartner;
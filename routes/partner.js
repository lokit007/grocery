// Model
var Partner = require("../models/partner.js");
// Định nghĩa route
var RoutePartner = function(app, pool) {
    // Danh sách khởi tạo
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
    // Thông tin chi tiết
    app.get('/partner/:id', function(req, res){
        var sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId, FullName ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "where IdSupplier = ? ";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, [req.params.id], function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var i = 0;
                        var obj = new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId, results[i].FullName);
                        res.send(obj);
                    } else {
                        res.send({});
                    }
                });
        });
    });
    // Danh sách tìm kiếm
    app.get('/search/partner', function(req, res){
        var sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId, FullName ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "where ContactName like N? and ContactPhone like ? and ContactEmail like ? and Address like N? ";
        sql += "limit ?, 10 ";
        var param = [
             "%"+req.query.name+"%", 
             "%"+req.query.phone+"%", 
             "%"+req.query.email+"%", 
             "%"+req.query.address+"%", 
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
                        objList.push(new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId, results[i].FullName));
                    }
                    res.send(objList);
                } else {
                    res.send([]);
                }
            });
        }); 
    });
    // Cập nhật dữ liệu
    app.post('/update/partner', function(req, res){
        var sql = "";
        var obj = {};
        var id = req.body.id;
        var dNow = new Date();
        if (id == '-1') {
            sql = "INSERT INTO `user` SET ?";
            obj = {
                FullName: req.body.delegate,
                Address: req.body.address,
                Phone: req.body.phone,
                Email: req.body.email
            };
        } else {
            sql = "UPDATE `user` SET FullName = ?, Address = ?, Phone = ?, Email = ? WHERE IdUser = ?";
            obj = [req.body.delegate, req.body.address, req.body.phone, req.body.email, id]
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
                        sql = "INSERT INTO `supplier` SET ?";
                        obj = {
                            ContactName: req.body.name,
                            ContactPhone: req.body.phone,
                            ContactEmail: req.body.email,
                            UserId: results.insertId
                        };
                    } else {
                        sql = "UPDATE `supplier` SET ContactName = ?, ContactPhone = ?, ContactEmail = ? WHERE IdSupplier = ?";
                        obj = [req.body.name, req.body.phone, req.body.email, id]
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
    // Xóa dữ liệu
    app.get('/delete/partner/:id', function(req, res){
        var sql = "DELETE FROM `user` WHERE IdUser=?";
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                connection.query(sql, [req.params.id], function(error, results, fields){
                    if(error) connection.rollback(function(){
                        res.send("Erorr");
                        throw error;
                    });
                    // Xóa dữ liệu có liên quan
                    var sqlDelRel = "DELETE FROM `supplier` WHERE UserId=?";
                    connection.query(sqlDelRel, [req.params.id], function(errorLog, resultLogs){
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
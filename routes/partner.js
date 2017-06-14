// Model
let Partner = require("../models/partner.js");
let Db = require("../models/database.js");

// Định nghĩa route
let RoutePartner = function(app, pool) {
    // Danh sách khởi tạo
    app.get('/partner', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "limit 0, 10 ";

        try {
            objDb.getData(sql)
            .then(results => {
                if (results.length>0) {
                    let objList = [];
                    for(let i=0; i<results.length; i++) {
                        objList.push(new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId));
                    }
                    res.render("home", {screen: 3, session: session, data : objList});
                } else {
                    res.render("home", {screen: 3, session: session, data : {}});
                }
            })
            .catch(error => {
                res.render("home", {screen: 3, session: session, data : {}});
            })
        } catch (error) {
            res.render("home", {screen: 3, session: session, data : {}});
        }
    });
    // Thông tin chi tiết
    app.get('/partner/:id', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId, FullName ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "where IdSupplier = ? ";
        
        try {
            objDb.getData(sql, [req.params.id])
            .then(results => {
                if (results.length>0) {
                    let i = 0;
                    let obj = new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId, results[i].FullName);
                    res.send(obj);
                } else {
                    res.send({});
                }
            })
            .catch(error => {
                res.send({});
            });
        } catch (error) {
            res.send({});
        }
    });
    // Danh sách tìm kiếm
    app.get('/search/partner', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select IdSupplier, ContactName, ContactPhone, ContactEmail, Address, UserId, FullName ";
        sql += "from `supplier` inner join `user` on UserId = IdUser ";
        sql += "where ContactName like N? and ContactPhone like ? and ContactEmail like ? and Address like N? ";
        sql += "limit ?, 10 ";
        let obj = [
             "%"+req.query.name+"%", 
             "%"+req.query.phone+"%", 
             "%"+req.query.email+"%", 
             "%"+req.query.address+"%", 
             parseInt(req.query.index)
        ];

        try {
            objDb.getData(sql, obj)
            .then(results => {
                if (results.length>0) {
                    let objList = [];
                    for(let i=0; i<results.length; i++) {
                        objList.push(new Partner(results[i].IdSupplier, results[i].ContactName, results[i].ContactPhone, results[i].ContactEmail, results[i].Address, results[i].UserId, results[i].FullName));
                    }
                    res.send(objList);
                } else {
                    res.send([]);
                }
            })
            .catch(error => {
                res.send([]);
            });
        } catch (error) {
            res.send([]);
        }
    });
    // Cập nhật dữ liệu
    app.post('/update/partner', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "";
        let obj = {};
        let sql1 = "";
        let obj1 = {};
        let id = req.body.id;
        let dNow = new Date();

        try {
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

            if (id == '-1') {
                sql1 = "INSERT INTO `supplier` SET ?";
                obj1 = {
                    ContactName: req.body.name,
                    ContactPhone: req.body.phone,
                    ContactEmail: req.body.email,
                    UserId: results.insertId
                };
            } else {
                sql1 = "UPDATE `supplier` SET ContactName = ?, ContactPhone = ?, ContactEmail = ? WHERE IdSupplier = ?";
                obj1 = [req.body.name, req.body.phone, req.body.email, id]
            }

            pool.getConnection(function(err, connection) {
                connection.beginTransaction(function(errTran){
                    if(errTran) throw errTran;
                    else objDb.executeQuery(sql, obj, connection)
                    .then(results => objDb.executeQuery(sql1, obj1, connection))
                    .then(results => {
                        connection.commit(function(errComit){
                            if(errComit) connection.rollback(function(){
                                res.send("Erorr");
                                throw errComit;
                            });
                            res.send("Success");
                        });
                    })
                    .catch(error => {
                        connection.rollback(function(){
                            res.send("Erorr");
                            throw error;
                        });
                    });
                });
            });
        } catch (error) {
            res.send("Erorr");
        }
    });
    // Xóa dữ liệu
    app.get('/delete/partner/:id', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "DELETE FROM `user` WHERE IdUser=?";
        let sql1 = "DELETE FROM `supplier` WHERE UserId=?";

        try {
            pool.getConnection(function(err, connection) {
                connection.beginTransaction(function(errTran){
                    if(errTran) throw errTran;
                    else objDb.executeQuery(sql, [req.params.id], connection)
                    .then(results => objDb.executeQuery(sql1, [req.params.id], connection))
                    .then(results => {
                        connection.commit(function(errComit){
                            if(errComit) connection.rollback(function(){
                                res.send("Erorr");
                                throw errComit;
                            });
                            res.send("Success");
                        });
                    })
                    .catch(error => {
                        connection.rollback(function(){
                            res.send("Erorr");
                            throw error;
                        });
                    });
                });
            });
        } catch (error) {
            res.send("Erorr");
        }
    });
}

module.exports = RoutePartner;
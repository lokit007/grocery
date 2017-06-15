// Model
let Personnel = require("../models/personnel.js");
let Db = require("../models/database.js");

// Route
let RoutePersonnel = function(app, pool) {
    // Mới khởi tạo
    app.get('/personnel', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, "
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description "
        sql += "from `admin` "
        sql += "inner join `user` on `admin`.UserId = `user`.IdUser "
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction "
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "limit 0, 10 ";

        try {
            objDb.getData(sql)
            .then(results => {
                if (results.length>0) {
                    let objList = [];
                    for(let i=0; i<results.length; i++) {
                        objList.push(new Personnel(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description));
                    }
                    res.render("home", {screen: 1, session: session, data : objList});
                } else {
                    res.render("home", {screen: 1, session: session, data : {}});
                }
            })
            .catch(error => {
                res.render("home", {screen: 1, session: session, data : {}});
            });
        } catch (error) {
            res.render("home", {screen: 1, session: session, data : {}});
        } 
    });
    // Thông tin theo id
    app.get('/personnel/:id', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, "
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description "
        sql += "from `admin` "
        sql += "inner join `user` on `admin`.UserId = `user`.IdUser "
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction "
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "where UserName = ?";

        try {
            objDb.getData(sql, [req.params.id])
            .then(results => {
                if (results.length>0) {
                    let i = 0;
                    let obj = new Personnel(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description)
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
    // Search
    app.get('/search/personnel', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, ";
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description ";
        sql += "from `admin` ";
        sql += "inner join `user` on `admin`.UserId = `user`.IdUser ";
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction ";
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "where UserName like ? and FullName like N? and IdentityCard like ? and `user`.Address like N? and `user`.Phone like ? ";
        sql += "limit ?, 10 ";
        let obj = [
            "%"+req.query.username+"%",
            "%"+req.query.fullname+"%",
            "%"+req.query.identitycard+"%",
            "%"+req.query.address+"%",
            "%"+req.query.phone+"%",
            parseInt(req.query.index)
        ];

        try {
            objDb.getData(sql, obj)
            .then(results => {
                if (results.length>0) {
                    let objList = [];
                    for(let i=0; i<results.length; i++) {
                        objList.push(new Personnel(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description));
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
    // Update
    app.post('/update/personnel', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "";
        let obj = {};
        let id = req.body.id;
        let dNow = new Date();
        
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

        try {
            pool.getConnection(function(err, connection) {
                connection.beginTransaction(function(errTran){
                    if(errTran) throw errTran;
                    else objDb.executeQuery(sql, obj, connection)
                    .then(results => {
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
                        return objDb.executeQuery(sql, obj, connection);
                    })
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
    // Delete
    app.get('/delete/personnel/:id', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "DELETE FROM `admin` WHERE UserName=?";

        try {
            pool.getConnection(function(err, connection) {
                connection.beginTransaction(function(errTran){
                    if(errTran) throw errTran;
                    else objDb.executeQuery(sql, [req.params.id], connection)
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
    // Load data
    app.get('/loaddata/jurisdiction', function(req, res) {
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = "select * from jurisdiction; ";
        sql += " select * from branch";

        try {
            objDb.getData(sql)
            .then(results => {
                if (results.length>0) {
                    res.send(results);
                } else {
                    res.send("Error");
                }
            })
            .catch(error => {
                res.send("Error");
            });
        } catch (error) {
            res.send("Error");
        }
    });
}

module.exports = RoutePersonnel;

// Model
var Warehouse = require("../models/warehouse.js");
var Db = require("../models/database.js");

// Route
var RouteWarehouse = function(app, pool) {
    // Mới khởi tạo
    app.get('/warehouse', function(req, res){
        var sql = "select BranchId, NameBranch as BranchName, ProductId, product.Name as ProductName, ";
        sql += "Price, NewNumber, NewPrice, OldNumber, OldPrice, ";
        sql += "CategoryId, `category`.Name as CategoryName from depot ";
        sql += "inner join `product` on ProductId = IdProduct ";
        sql += "inner join `branch` on BranchId = IdBranch ";
        sql += "inner join `category` on CategoryId = IdCategory ";
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
                            objList.push(new Warehouse(results[i].BranchId, results[i].BranchName, results[i].ProductId, results[i].ProductName, results[i].Price, results[i].NewNumber, results[i].NewPrice, results[i].OldNumber, results[i].OldPrice, results[i].CategoryId, results[i].CategoryName));
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
        var sql = "select * from branch; ";
        sql += " select * from category; ";
        sql += " select * from supplier ";
        
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
    // import data excel
    app.post('/importexcel/warehouse', function(req, res){
        var arrlist = JSON.parse(req.body.listproduct);
        var sql = "";
        var idProduct = "";
        var idCategory = "";
        var idSupplier = "";
        var idBranch = "";
        var dNow = new Date();
        var isInsert = false;
        var oldId = "";
        var newId = "";
        var idWarehousing = "";
        // sort data
        arrlist.sort(function(a, b){
            if (a["Nhà cung cấp"] > b["Nhà cung cấp"]) return 1;
            else if (a["Chi nhánh"] > b["Chi nhánh"]) return 1;
            else return 0;
        });
        // update data
        let objDb = new Db(pool);
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                else {
                    try {
                        arrlist.forEach(function( val, ind){
                            newId = val["Nhà cung cấp"] + val["Chi nhánh"];
                            sql = " select `category`.IdCategory from `category` where `category`.Name like N?; ";
                            sql += " select `product`.IdProduct from `product` where `product`.Name like N?;";
                            sql += " select `supplier`.IdSupplier from `supplier` where `supplier`.ContactName like N?; ";
                            sql += " select `branch`.IdBranch from `branch` where `branch`.NameBranch like N?; ";
                            objDb.executeQuery(sql, [val["Danh mục"], val["Sản phẩm"], val["Nhà cung cấp"], val["Chi nhánh"]], connection).then(results => {
                                // Get IdCategory
                                return new Promise((resolve, reject) => {
                                    if (results[0].length < 1) {
                                        let sqlInsert = "INSERT INTO `category` SET ?";
                                        var obj = {
                                            Name: val["Danh mục"],
                                            DateCreate: dNow.toLocaleString(),
                                            State: 0
                                        }
                                        objDb.executeQuery(sqlInsert, obj, connection)
                                        .then(result => {
                                            idCategory = result.insertId;
                                            return resolve(results);
                                        }).catch(error => reject(error));
                                    } else {
                                        idCategory = results[0][0].IdCategory;
                                        return resolve(results);
                                    }
                                });
                            })
                            .then(results => {
                                // Get IdProduct
                                return new Promise((resolve, reject) => {
                                    if (results[1].length < 1) {
                                        let sqlInsert = "INSERT INTO `product` SET ?";
                                        let obj = {
                                            CategoryId: idCategory,
                                            Name: val["Sản phẩm"],
                                            Price: val["Giá nhập"],
                                            DateUpdate: dNow.toLocaleString()
                                        }
                                        objDb.executeQuery(sqlInsert, obj, connection)
                                        .then(result => {
                                            idProduct = result.insertId;
                                            isInsert = true;
                                            return resolve(results);
                                        }).catch(error => reject(error));
                                    } else {
                                        idProduct = results[1][0].IdProduct;
                                        return resolve(results);
                                    }
                                });
                            })
                            .then(results => {
                                // Get IdSupplier
                                return new Promise((resolve, reject) => {
                                    if (results[2].length < 1) {
                                        let sqlInsert = "INSERT INTO `supplier` SET ?";
                                        let obj = {
                                            ContactName: val["Nhà cung cấp"],
                                            ContactPhone: "01234567899"
                                        }
                                        objDb.executeQuery(sqlInsert, obj, connection)
                                        .then(result => {
                                            idSupplier = result.insertId;
                                            return resolve(results);
                                        }).catch(error => reject(error));
                                    } else {
                                        idSupplier = results[2][0].IdSupplier;
                                        return resolve(results);
                                    }
                                });
                            })
                            .then(results => {
                                // Update kho hàng
                                return new Promise((resolve, reject) => {
                                    if (results[3].length < 1) reject(new Error("Chi nhánh không tồn tại trong hệ thống!"));
                                    else {
                                        // update table depot
                                        idBranch = results[3][0].IdBranch;
                                        let sqlUpdate = "INSERT INTO `depot` SET ?";
                                        let obj = {
                                            BranchId: idBranch,
                                            ProductId: idProduct,
                                            NewNumber: val["Số lượng nhập"],
                                            NewPrice: val["Giá nhập"],
                                            OldNumber: 0,
                                            OldPrice: 0,
                                            DateUpdate: dNow.toLocaleString(),
                                            State: 0
                                        }
                                        if (isInsert == false) {
                                            sqlUpdate = "UPDATE `depot` SET NewNumber += ?, NewPrice = ?, DateUpdate = ? WHERE BranchId = ? AND ProductId = ?";
                                            obj = [val["Số lượng nhập"],val["Giá nhập"], dNow.toLocaleString(), idBranch, idProduct];
                                        }
                                        objDb.executeQuery(sqlUpdate, obj, connection)
                                        .then(result => {
                                            idSupplier = result.insertId;
                                            return resolve(results);
                                        })
                                        .then(result => {
                                            // update table warehousing
                                            isInsert = true;
                                            sqlUpdate = "INSERT INTO `warehousing` SET ?";
                                            obj = {
                                                SupplierId: idSupplier,
                                                BranchId: idBranch,
                                                DateCreate: dNow.toLocaleString(),
                                                TotalCost: val["Số lượng nhập"],
                                                Tax: 0
                                            }
                                            if (oldId === newId) {
                                                isInsert = false;
                                                sqlUpdate = "UPDATE `warehousing` SET NewNumber += ?, NewPrice = ?, DateUpdate = ? WHERE BranchId = ? AND ProductId = ?";
                                                obj = [val["Số lượng nhập"],val["Giá nhập"], dNow.toLocaleString(), idBranch, idProduct];
                                            } else oldId = newId;
                                            objDb.executeQuery(sqlUpdate, obj, connection)
                                            .then(result => {
                                                if(isInsert == true) idWarehousing = result.insertId;
                                                return resolve(results);
                                            })
                                            .catch(error => reject(error))
                                        })
                                        .then(result => {
                                            // update table detailwarehousing
                                            sqlUpdate = "INSERT INTO `detailwarehousing` SET ?";
                                            obj = {
                                                WarehousingId: idWarehousing,
                                                ProductId: idProduct,
                                                Price: val["Giá nhập"],
                                                Number: val["Số lượng nhập"],
                                                Tax: 0
                                            }
                                            objDb.executeQuery(sqlUpdate, obj, connection)
                                            .then(result => {
                                                if(isInsert == true) idWarehousing = result.insertId;
                                                return resolve(results);
                                            })
                                            .catch(error => reject(error))
                                        })
                                        .catch(error => reject(error));
                                    }
                                });
                            })
                        });
                        connection.commit(function(errComit){
                            if(errComit) connection.rollback(() => {
                                res.send("Thay đổi thất bại");
                            });
                            res.send("Thay đổi ok")
                        });
                    } catch (error) {
                        connection.rollback(() => {
                            res.send("Thay đổi thất bại");
                        });
                    } finally {
                        connection.release();
                    }
                    
                }
            });
        });
    });
    
    app.get('/demo', function(req, res1) {
        let objDb = new Db(pool);
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(errTran){
                if(errTran) throw errTran;
                else {
                    objDb.executeQuery("INSERT INTO `category` SET ?", {Name: "Danh mục 1", DateCreate: "2017/06/04", State: 0}, connection)
                    .then(res => objDb.executeQuery("INSERT INTO `product` SET ?", {CategoryId: res.insertId, Name: "Sản phẩm 1", Price: 5000, DateUpdate: "2017/06/04"}, connection))
                    .then(res => objDb.executeQuery("INSERT INTO `category` SET ?", {Name: "Danh mục 2", DateCreate: "2017/06/04", State: 0}, connection))
                    .then(res => objDb.executeQuery("INSERT INTO `prodct` SET ?", {CategoryId: res.insertId, Name: "Sản phẩm 2", Price: 5000, DateUpdate: "2017/06/04"}, connection))
                    .then(res => {
                        connection.commit(function(errComit){
                            connection.release();
                            if(errComit) connection.rollback(() => {
                                res1.send("Thay đổi thất bại");
                            });
                            res1.send("Thay đổi ok")
                        });
                    })
                    .catch(err => {
                        connection.release();
                        connection.rollback(() => {
                            res1.send("Thay đổi thất bại");
                        });
                    });
                }
            });
        });
    });
}

module.exports = RouteWarehouse;

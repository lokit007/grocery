// Model
var Category = require("../models/category.js");
// Định nghĩa route
var RouteCategory = function(app, pool) {
    // Danh sách category mới khởi tạo
    app.get('/category', function(req, res){
        var sql = "select IdCategory, `category`.Name, Description, State, Count(IdProduct) as NumberProduct from `category` ";
        sql += "left join `product` on `category`.IdCategory = `product`.CategoryId "
        sql += "group by IdCategory, `category`.Name, Description, State "
        sql += "order by IdCategory "
        sql += "limit 0, 10 ";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Category(results[i].IdCategory, results[i].Name, results[i].Description, results[i].State, results[i].NumberProduct));
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
        var sql = "SELECT * FROM `category` WHERE IdCategory=?";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, [req.params.id], function (error, results, fields) {
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
        var sql = "select IdCategory, `category`.Name, Description, State, Count(IdProduct) as NumberProduct from `category` ";
        sql += "left join `product` on `category`.IdCategory = `product`.CategoryId "
        sql += "where `category`.Name like N? "
        sql += "group by IdCategory, `category`.Name, Description, State "
        sql += "order by IdCategory "
        sql += "limit ?, 10 ";
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, ["%"+req.query.name+"%", parseInt(req.query.index)], function (error, results, fields) {
                connection.release();
                if (error) throw error;
                else if (results.length>0) {
                    var objList = [];
                    for(var i=0; i<results.length; i++) {
                        objList.push(new Category(results[i].IdCategory, results[i].Name, results[i].Description, results[i].State, results[i].NumberProduct));
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
    app.get('/delete/category/:id', function(req, res){
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

module.exports = RouteCategory;
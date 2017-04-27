// Model
var Personnel = require("../models/personnel.js");
// Route
var RoutePersonnel = function(app, pool) {
    //
    app.get("/personnel", function(req, res){
        res.render("home", {screen: 1, data : {}});
    });
    // Danh sách category mới khởi tạo
    app.get('/personnel', function(req, res){
        var sql = "select UserName, PassWord, IdentityCard, TotalSalary, ";
        sql += "UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, BranchId, NameBranch, "
        sql += "JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description "
        sql += "from `admin` "
        sql += "finner join `user` on `admin`.UserId = `user`.IdUser "
        sql += "inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction "
        sql += "inner join `branch` on `admin`.BranchId = `branch`.IdBranch ";
        sql += "limit 0, 10 ";

        pool.getConnection(function(err, connection) {
            if (err) throw err;
            else connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    else if (results.length>0) {
                        var objList = [];
                        for(var i=0; i<results.length; i++) {
                            objList.push(new Personnel(results[i].UserName, results[i].PassWord, results[i].IdentityCard, results[i].TotalSalary, results[i].UserId, results[i].FullName, results[i].Address, results[i].Phone, results[i].Email, results[i].BranchId, results[i].NameBranch, results[i].JurisdictionId, results[i].NameJurisdiction, results[i].Description));
                        }
                        res.render("home", {screen: 1, data : objList});
                    } else {
                        res.render("home", {screen: 1, data : {}});
                    }
                });
        }); 
    });
    // Lấy thông tin một danh mục
    app.get('/personnel/:id', function(req, res){
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
    app.get('/search/personnel', function(req, res){
        var sql = "select IdCategory, `category`.Name, Description, State, Count(IdProduct) as NumberProduct from `category` ";
        sql += "left join `product` on `category`.IdCategory = `product`.CategoryId "
        sql += "where `category`.Name like N'%" + req.query.name + "%' "
        sql += "group by IdCategory, `category`.Name, Description, State "
        sql += "order by IdCategory "
        sql += "limit "+req.query.index+", 10 ";
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
                        res.send(objList);
                    } else {
                        res.send([]);
                    }
                });
        }); 
    });
    // Thêm, cập nhật một category
    app.post('/update/personnel', function(req, res){
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
    app.get('/delete/personnel/:id', function(req, res){
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
                    var sqlDelRel = "DELETE FROM `product` WHERE CategoryId='"+req.params.id+"'";
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

module.exports = RoutePersonnel;

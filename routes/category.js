// Model
let Category = require("../models/category.js");
let Db = require("../models/database.js");

// Định nghĩa route
let RouteCategory = function(app, pool) {
    // Danh sách category mới khởi tạo
    app.get('/category', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = `select IdCategory, category.Name, Description, State, Count(IdProduct) as NumberProduct, BranchId, NameBranch from category 
        left join product on category.IdCategory = product.CategoryId 
        left join depot on ProductId = IdProduct 
        left join branch on BranchId = IdBranch `;
        if(session.jurisdiction > 1) sql += `where BranchId = ` + session.branch + ` or BranchId is null `; 
        sql += `group by IdCategory, category.Name, Description, State 
        order by IdCategory 
        limit 0, 10;`;

        try {
            objDb.getData(sql)
            .then(results => {
                if (results.length>0) {
                    let objList = [];
                    for(let i=0; i<results.length; i++) {
                        objList.push(new Category(results[i].IdCategory, results[i].Name, results[i].Description, results[i].State, results[i].NumberProduct));
                    }
                     res.render("home", {screen: 2, session: session, data : objList});
                } else {
                     res.render("home", {screen: 2, session: session, data : {}});
                }
            })
            .catch(error => {
                res.render("home", {screen: 2, session: session, data : {}});
            });
        } catch (error) {
            res.render("home", {screen: 2, session: session, data : {}});
        }
    });
    // Lấy thông tin một danh mục
    app.get('/category/:id', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = `select IdCategory, category.Name, Description, State, Count(IdProduct) as NumberProduct, BranchId, NameBranch from category 
        left join product on category.IdCategory = product.CategoryId 
        left join depot on ProductId = IdProduct 
        left join branch on BranchId = IdBranch 
        where IdCategory = ? `;
        if(session.jurisdiction > 1) sql += `and (BranchId = ` + session.branch + ` or BranchId is null) `; 
        sql += `group by IdCategory, category.Name, Description, State 
        order by IdCategory 
        limit 0, 10;`;

        try {
            objDb.getData(sql, [req.params.id])
            .then(results => {
                if (results.length>0) {
                    let obj = new Category(results[0].IdCategory, results[0].Name, results[0].Description, results[0].State);
                    res.send(obj);
                } else {
                    res.send({});
                }
            })
            .catch(error => {
                console.log(error);
                res.send({});
            });
        } catch (error) {
            console.log(error);
            res.send({});
        }
    });
    // Lấy danh sách danh mục tìm kiếm autocomplex
    app.get('/search/category', function(req, res){
        let objDb = new Db(pool);
        let session = req.session.admin;
        let sql = `select IdCategory, category.Name, Description, State, Count(IdProduct) as NumberProduct, BranchId, NameBranch from category 
        left join product on category.IdCategory = product.CategoryId 
        left join depot on ProductId = IdProduct 
        left join branch on BranchId = IdBranch 
        where category.Name like N? `;
        if(session.jurisdiction > 1) sql += `and (BranchId = ` + session.branch + ` or BranchId is null) `; 
        sql += `group by IdCategory, category.Name, Description, State 
        order by IdCategory 
        limit ?, 10;`;

        try {
            objDb.getData(sql, ["%"+req.query.name+"%", parseInt(req.query.index)])
            .then(results => {
                if (results.length>0) {
                    let objList = [];
                    for(let i=0; i<results.length; i++) {
                        objList.push(new Category(results[i].IdCategory, results[i].Name, results[i].Description, results[i].State, results[i].NumberProduct));
                    }
                    res.send(objList);
                } else {
                    res.send([]);
                }
            })
            .catch(error => {
                console.log(error);
                res.send([]);
            });
        } catch (error) {
            console.log(error);
            res.send([]);
        }
    });
    // Thêm, cập nhật một category
    app.post('/update/category', function(req, res){
        let objDb = new Db(pool);
        let sql = "";
        let obj = {};
        let id = req.body.id;
        let dNow = new Date();

        try {
            if (id == '-1') {
                sql += "INSERT INTO `category` SET ?";
                obj = {
                    Name: req.body.name,
                    Description: req.body.description,
                    DateCreate: dNow.toLocaleString(),
                    State: 0
                }
            } else {
                sql += "UPDATE `category` SET Name = ?, Description = ? where IdCategory = ?";
                obj = [req.body.name, req.body.description, id]
            }
            pool.getConnection(function(err, connection) {
                connection.beginTransaction(function(errTran){
                    if(errTran) throw errTran;
                    else objDb.executeQuery(sql, obj, connection)
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
                            throw errComit;
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            res.send("Erorr");
        }
    });
    // Xóa category
    app.get('/delete/category/:id', function(req, res){
        let objDb = new Db(pool);
        let sql = "delete from `category` where IdCategory=?";
        let sql1 = "delete from `product` where CategoryId=?";

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
                            throw errComit;
                        });
                    });
                });
            });
        } catch (error) {
            res.send("Erorr");
        }
    });
}

module.exports = RouteCategory;
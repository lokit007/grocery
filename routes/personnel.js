// Model
var Personnel = require("../models/personnel.js");
// Route
var RoutePersonnel = function(app, pool) {
    app.get("/personnel", function(req, res){
        res.render("home", {screen: 1, data : {}});
    });
}

module.exports = RoutePersonnel;

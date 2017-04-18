var objBranch = function Branch(id, name, address, phone, email, fax) {
    this.id = id,
    this.name = name,
    this.address = address,
    this.email = email,
    this.phone = phone,
    this.fax = fax
}
objBranch = function Branch() {}
// Tìm kiếm bằng ID
objBranch.prototype.findById = function(id, pool) {
    var sql = "SELECT * FROM `branch` WHERE IdBranch='"+id+"'"; // Thực hiện câu truy vấn và show dữ liệu
    pool.getConnection(function(err, connection) {
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if (error) throw error;
            else if (results.length>0) {
                var obj = new objBranch(results[0].IdBranch, results[0].NameBranch, results[0].Address, results[0].Phone, results[0].Email, results[0].Fax);
                console.log(results[0]);
                return obj;
            } else {
                throw error;
            }
        });
    });
}
// Tìm kiếm tùy chọn
objBranch.prototype.findAll = function(name, address, phone, email, pool) {
    var lsResult = [];
    lsResult.push(new objBranch('1', 'Chi nhánh 1', 'Địa chỉ 1', '01234567899', 'email1@gmail.com', '123'));
    lsResult.push(new objBranch('2', 'Chi nhánh 2', 'Địa chỉ 1', '01234567899', 'email1@gmail.com', '123'));
    lsResult.push(new objBranch('3', 'Chi nhánh 3', 'Địa chỉ 1', '01234567899', 'email1@gmail.com', '123'));
    return lsResult;
}

// Tìm kiếm theo vị trí

module.exports = objBranch;
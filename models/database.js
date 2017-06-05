function Db(pool) {
    // Get Data
    this.getData = (sql, p) => {
        return new Promise((resolve, reject) => {
            if(p == undefined) pool.getConnection((err, connection) => {
                if (err) reject(err);
                else connection.query(sql, (error, results, fields) => {
                        connection.release();
                        if (error) reject(error);
                        else resolve(results);
                    });
            });
            else pool.getConnection((err, p, connection) => {
                if (err) reject(err);
                else connection.query(sql, (error, results, fields) => {
                        connection.release();
                        if (error) reject(error);
                        else resolve(results);
                    });
            });
        });
    },
    // Change Data
    this.changeData = (sql, p, conn) => {
        return new Promise((resolve, reject) => {
            if(p == undefined) conn.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
            else conn.query(sql, p, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }
}

module.exports = Db;
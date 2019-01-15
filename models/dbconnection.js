var mysql = require('mysql');
port = process.env.PORT || 3001;
const db_info = require("../config/keys");

var connection = mysql.createConnection({
    host: db_info.host,
    user: db_info.user,
    password: db_info.password,
    database: db_info.database
});

connection.connect();
module.exports = connection;
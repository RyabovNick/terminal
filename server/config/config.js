var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'Qwerty789#',
    database: 'terminal'
})

module.exports = pool

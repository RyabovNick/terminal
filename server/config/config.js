var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 100,
    host: '78.155.199.17',
    user: 'nick',
    password: '1010222q',
    database: 'terminal'
})

module.exports = pool

var pool = mysql.createPool({
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'root',
    password: 'Qwerty789#',
    database: 'collegeuni_test'
})

module.exports = pool

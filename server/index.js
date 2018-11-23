var express = require('express'),
    bodyParser = require('body-parser'),
    pool = require('./config/config'),
    formidable = require('formidable'),
    //for https and cors
    //cors = require('cors'),
    https = require('https'),
    fs = require('fs')
/* get .key and .cert to https
    var sslOptions = {
        key: fs.readFileSync('key.key'),
        cert: fs.readFileSync('cert.crt')
    }
*/

var app = express()

//app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})*/

app.get('/api/getFiles', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) throw err

        console.log(req.body)

        connection.query('Select * from files', function(error, result) {
            if (error) throw error
            console.log(result)
            res.send(result)
        })
    })
})

app.get('/api/getVideos', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) throw err

        console.log(req.body)

        connection.query('Select * from pictures', function(error, result) {
            if (error) throw error
            console.log(result)
            res.send(result)
        })
    })
})

/**
 * upload html page
 */
app.get('/upload_form', function(req, res, next) {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(
        '<form action="/api/upload_videos" enctype="multipart/form-data" method="post">' +
            'Name: <input type="text" name="name"><br>' +
            'DateFrom: <input type="datetime" name="dateFrom" value="2018-11-23 17:01:24"><br>' +
            'DateTo: <input type="datetime" name="dateTo" value="2018-11-25 17:01:24"><br>' +
            '<input type="file" name="upload"><br>' +
            '<input type="submit" value="Upload">' +
            '</form>'
    )
})

/**
 * Upload files API
 */
app.post('/api/upload_videos', function(req, res, next) {
    var table = req.params.table
    var form = new formidable.IncomingForm(),
        files = {},
        fields = {},
        allFiles = []

    form.uploadDir = '../html/files'
    form.keepExtensions = true
    form.multiples = true

    var query_result = [] //save all insert responses

    form.parse(req)
        .on('file', function(name, file) {
            files[name] = file
            allFiles.push({ name, file })
        })
        .on('field', function(name, field) {
            fields[name] = field
        })
        .on('error', function(err) {
            next(err)
        })
        .on('end', function() {
            if (fields.name == '') {
                fields.name = files.upload.name
            }
            pool.getConnection(function(err, con) {
                if (err) return res.status(406).send(err)
                /*array1.forEach(function(element) {
				    console.log(element);
				});
				*/
                allFiles.forEach(function(el) {
                    //console.log('fields.dateFrom: ', fields.dateFrom)
                    //console.log('fields.dateTo: ', fields.dateTo)
                    console.log('el.file.name: ', el.file.name)
                    console.log('el.file.path: ', el.file.path)
                    con.query(
                        'Insert into `files` (name,link, type) values (?,?,0)',
                        [el.file.name, el.file.path],
                        function(error, result) {
                            if (error) return res.status(406).send(error)
                            console.log(result)
                            query_result.push(result)
                        }
                    )
                })
                con.release()
            })
            res.writeHead(200, { 'content-type': 'text/plain' })
            res.end()
        })
})

// change server = app..... to this if https needed
//https.createServer(sslOptions, app).listen(8444);
// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port ' + server.address().port)
})

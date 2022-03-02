var express = require('express');
var app = express();
var uuid = require('node-uuid');

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Routes
app.get('/api/status', function(req, res) {
  pool.query('SELECT NOW()', (err, result) => {
	  console.log(result);
    if(err) {
      return res.status(500).send('error running query');
    }
    return res.json({
      request_uuid: uuid.v4(),
      time: result["rows"][0]["now"]
    });
    pool.end()
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

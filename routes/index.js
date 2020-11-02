var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.sendFile(process.cwd()+'/resources/login.html');
});

/* GET login.js page. */
router.get('/login.js', function(req, res, next) {
  res.sendFile(process.cwd()+'/resources/login.js');
});

/* GET login.css page. */
router.get('/login.css', function(req, res, next) {
  res.sendFile(process.cwd()+'/resources/login.css');
});

/* GET main page. */
router.get('/index', function(req, res, next) {
  res.sendFile(process.cwd()+'/resources/index.html');
});

/* GET main.js page. */
router.get('/script.js', function(req, res, next) {
  res.sendFile(process.cwd()+'/resources/script.js');
});

/* GET style.js page. */
router.get('/style.css', function(req, res, next) {
  res.sendFile(process.cwd()+'/resources/style.css');
});


module.exports = router;

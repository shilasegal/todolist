var express = require('express');
var router = express.Router();

const Dal = require("../dal/dal");
let dbAccess = new Dal();


/* GET users listing. */
router.get('/login', function(req, res, next) {
  dbAccess.getUser(req.query.user_name, (user_id) => {
    res.json({"user_id":user_id});
  });
});

/* POST users listing. */
router.post('/signin', function(req, res, next) {
  dbAccess.setUser(req.query.user_name,req.query.user_id, (user_id) => {
    res.json({"user_id":user_id});
  });
});

module.exports = router;

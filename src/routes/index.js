var express = require('express');
var router = express.Router();

/* GET index (Pagina principal) */
router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;

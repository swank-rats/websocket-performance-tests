var express = require('express');
var router = express.Router();

(function(console) {
    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });
})(console.t('routes/index.js'));

module.exports = router;

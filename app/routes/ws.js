var express = require('express'),
    router = express.Router(),
    utils = require('../utils');

/* GET echo page. */
router.get('/echo', function(req, res) {
    console.t('ECHO').log('started');

    res.render('echo', { title: 'Echo', ip: utils.getInterface().address, port: 3000 });
});

module.exports = router;

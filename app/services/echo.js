var WebSocketServer = require('ws').Server, wss,
    utils = require('../utils');

module.exports.init = function(config) {
    wss = new WebSocketServer(config);

    wss.on('connection', function(ws) {
        var i = 0, time, results = [];

        ws.on('message', function() {
            results.push(utils.getTime() - time);

            if (i >= 99) {
                var stat = utils.getStatistics(results);
                console.t('ECHO').statistic(JSON.stringify(stat));
            } else {
                i++;
                time = utils.getTime();
                ws.send(i + '');
            }
        });

        time = utils.getTime();
        ws.send(i + '');
    });
};

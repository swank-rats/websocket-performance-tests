var WebSocketServer = require('ws').Server, wss,
    utils = require('../utils'),
    phony = require('phony').make_phony();

module.exports.init = function(config) {
    wss = new WebSocketServer(config);

    wss.on('connection', function(ws) {
        var i = 0, time, results = [], size = 1024, data = phony.letters(size), x = 0;

        ws.on('message', function() {
            results.push(utils.getTime() - time);

            if (i >= 100) {
                var stat = utils.getStatistics(results);
                console.t('ECHO').statistic(JSON.stringify(stat));

                stat.finished = true;
                stat.last = true;
                ws.send(JSON.stringify(stat));

                x++;
                data = phony.letters(size*Math.pow(10, x));
            }
            if (x < 10) {
                i++;
                time = utils.getTime();
                ws.send({count: i, finished: false, name: 'data 1kb'});
            }
        });

        time = utils.getTime();
        ws.send(JSON.stringify({count: i, finished: false, name: 'data 1kb'}));
    });
};

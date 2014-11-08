var utils = require('../utils'),
    phony = require('phony').make_phony(),
    $ = require('jquery-deferred'),
    echoCommand = function(socket, data, last, name, tag, amount) {
        var i = 0,
            results = [],
            time,
            def = $.Deferred(),
            handler = function() {
                results.push(utils.getTime() - time);

                if (i >= amount - 1) {
                    var stat = utils.getStatistics(results);
                    stat.dataLength = data.length;

                    console.t(tag).statistic(JSON.stringify(stat));

                    stat.finished = true;
                    stat.last = last;
                    stat.name = name;
                    socket.send(JSON.stringify(stat));
                    socket.removeAllListeners('data');

                    def.resolve();
                } else {
                    i++;
                    time = utils.getTime();
                    socket.send(data);
                }
            };

        socket.on('data', handler);

        time = utils.getTime();
        socket.send(data);

        return def.promise();
    };

module.exports = function(app) {
    app.on('command.echo', function(socket) {
        echoCommand(socket, '', false, 'No Data', 'ECHO', 10000).then(function() {
            echoCommand(socket, phony.letters(1024), false, '1 kb', 'ECHO', 1000).then(function() {
                echoCommand(socket, phony.letters(1024 * 10), false, '10 kb', 'ECHO', 1000).then(function() {
                    echoCommand(socket, phony.letters(1024 * 100), false, '100 kb', 'ECHO', 1000).then(function() {
                        echoCommand(socket, phony.letters(1024 * 1000), true, '1000 kb', 'ECHO', 1000).then(function() {
                            console.t('ECHO').log('end');
                        });
                    });
                });
            });
        });
    });
};

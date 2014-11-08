var utils = require('../utils');

module.exports = function(app) {
    app.events.on('message.echo', function(socket) {
        var i = 0,
            results = [],
            time,
            handler = function() {
                results.push(utils.getTime() - time);

                if (i >= 9999) {
                    var stat = utils.getStatistics(results);
                    console.t('ECHO').statistic(JSON.stringify(stat));

                    stat.finished = true;
                    stat.last = true;
                    stat.name = 'echo';
                    socket.send(JSON.stringify(stat));
                    socket.events.removeAllListeners();
                } else {
                    i++;
                    time = utils.getTime();
                    socket.send('');
                }
            };

        socket.events.on('message', handler);

        time = utils.getTime();
        socket.send('');
    });
};

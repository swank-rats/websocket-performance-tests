var WebSocketServer = require('ws').Server, wss,
    utils = require('../utils'),
    events = require('events');

module.exports = function(app) {
    wss = new WebSocketServer({server: app.server});

    wss.on('connection', function(socket) {
        socket.events = new events.EventEmitter();

        socket.on('message', function(message) {
            var data = {};

            try {
                data = JSON.parse(message);
            } catch (e) {
            }

            if (!!data.cmd) {
                app.events.emit('message.' + data.cmd, socket, data);
            }

            socket.events.emit('message', socket, data);
        });
    });
};

var chai = require('chai'),
    http = require('http'),
    sinonChai = require('sinon-chai'),
    expect = require('chai').expect,
    WebSocketServer = require('ws').Server,
    utils = require('../utils'),
    Twig = require('twig'),
    twig = Twig.twig;

chai.should();
chai.use(sinonChai);

describe('#phantom', function() {
    var app, server, httpServer, client, port = 8080, x = false;

    beforeEach(function(done) {
        app = utils.startServer('one-way.twig', port);

        httpServer = http.createServer(app);
        httpServer.listen(port);

        server = new WebSocketServer({server: httpServer});

        utils.openBrowser(port);

        server.on('connection', function(socket) {
            if (!x) {
                client = socket;
                x = true;
                done();
            }
        });
    });

    afterEach(function() {
        httpServer.close();
    });

    it('huge-data', function(done) {
        var time, i = 0, results = [], writeData = '';

        for (var x = 0; x < 1024 * 1024; x++) {
            writeData += 'a';
        }

        client.on('message', function() {
            var result = (utils.getTime() - time);
            results.push(result);

            if (i >= 100) {
                var min = Math.min.apply(null, results),
                    max = Math.max.apply(null, results),
                    sum = results.reduce(function(a, b) {
                        return a + b
                    }),
                    avg = sum / results.length;

                console.log('');
                console.log('Result: ');
                console.log('count: ' + results.length);
                console.log('min:   ' + min + ' ns');
                console.log('max:   ' + max + ' ns');
                console.log('sum:   ' + sum + ' ns');
                console.log('avg:   ' + avg + ' ns');

                done();
            } else {
                i++;
                time = utils.getTime();
                client.send(writeData);
            }
        });

        time = utils.getTime();
        i++;
        client.send(writeData);
    });
});

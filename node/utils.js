var os = require('os'),
    express = require('express'),
    interfaces = os.networkInterfaces(),
    phantom = require('phantom');

exports.startServer = function(template, port) {
    app = express();
    var item = this.getInterface();

    app.get('/', function(req, res) {
        res.render(template, {
            ip: item.address,
            port: port
        });
    });

    return app;
};

exports.openBrowser = function(port) {
    var url = 'http://' + this.getInterface().address + ':' + port;

    phantom.create(function(ph) {
        ph.createPage(function(page) {
            page.open(url, function(status) {
            });
        });
    });
};

exports.getInterface = function() {
    for (key in interfaces) {
        if (interfaces.hasOwnProperty(key) && key !== 'lo0') {
            var item = interfaces[key];
            for (innerKey in item) {
                if (item.hasOwnProperty(innerKey) && item[innerKey].family === 'IPv4' && item[innerKey].internal === false) {
                    return item[innerKey];
                }
            }
        }
    }
};

exports.getTime = function() {
    var hrTime = process.hrtime();

    return hrTime[0] * 1000000 + hrTime[1] / 1000;
};

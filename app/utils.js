var os = require('os'),
    interfaces = os.networkInterfaces();

exports.getTime = function() {
    var hrTime = process.hrtime();

    return hrTime[0] * 1000000 + hrTime[1] / 1000;
};

exports.getStatistics = function(values) {
    var count = values.length,
        min = Math.min.apply(null, values),
        max = Math.max.apply(null, values),
        sum = values.reduce(function(a, b) {
            return a + b
        }),
        avg = sum / values.length;

    return {
        count: count,
        firstValue: values[0],
        lastValue: values.slice(-1)[0],
        min: min,
        max: max,
        sum: sum,
        avg: avg
    }
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

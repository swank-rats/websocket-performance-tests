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
        min: min,
        max: max,
        sum: sum,
        avg: avg
    }
};

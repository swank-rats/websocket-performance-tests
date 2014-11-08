var scribe = require('scribe');

// Configuration
scribe.configure(function(){
    scribe.set('app', 'Swank-Rats');
    scribe.set('logPath', './logs');
    scribe.set('defaultTag', 'DEFAULT_TAG');
    scribe.set('divider', ':::');
    scribe.set('identation', 5);

    scribe.set('maxTagLength', 30);

    scribe.set('mainUser', process.env.USER);
});

// Create Loggers
scribe.addLogger('log', true, true, 'green');
scribe.addLogger('statistic', true, true, 'white');
scribe.addLogger('info', true, true, 'cyan');
scribe.addLogger('error', true, true, 'red');

module.exports = scribe;

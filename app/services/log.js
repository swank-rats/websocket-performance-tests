var scribe = require('scribe');

// Configuration
// --------------
scribe.configure(function(){
    scribe.set('app', 'MY_APP_NAME');                     // NOTE Best way learn about these settings is
    scribe.set('logPath', '../logs');                     // them out for yourself.
    scribe.set('defaultTag', 'DEFAULT_TAG');
    scribe.set('divider', ':::');
    scribe.set('identation', 5);                          // Indentation before console messages

    scribe.set('maxTagLength', 30);                       // Any tags that have a length greater than
    // 30 characters will be ignored

    scribe.set('mainUser', 'root');                       // Username of the account which is running
    // the NodeJS server
});

// Create Loggers
// --------------
scribe.addLogger("log", true , true, 'green');            // (name, save to file, print to console,
scribe.addLogger('realtime', true, true, 'underline');    // tag color)
scribe.addLogger('high', true, true, 'magenta');
scribe.addLogger('normal', true, true, 'white');
scribe.addLogger('low', true, true, 'grey');
scribe.addLogger('info', true, true, 'cyan');

module.exports = scribe;

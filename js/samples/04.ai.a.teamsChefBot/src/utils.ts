export function setupConsoleLogToFile() {
    var fs = require('fs');
    var util = require('util');
    var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
    var log_stdout = process.stdout;

    console.log = function(d) { //
        var s = util.format(d).replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    log_file.write(s + '\n');
    log_stdout.write(util.format(d) + '\n');
    };
}
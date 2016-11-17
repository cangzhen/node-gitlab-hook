/**

 */
    "use strict";
let Util = require('util');
let inspect = Util.inspect;
let Path = require('path');
let Os = require('os');
let Tmp = require('temp');
let Fs = require('fs');
Tmp.track();
let execFile = require('child_process').execFile;

/**
 * 执行shell命令
 * @param cmds
 * @param opts
 * @param cb
 */
module.exports = function executeShellCmds(cmds, opts, cb) {
    if (!opts)opts = {};
    let cmdshell = opts.cmdshell || '/bin/sh';
    let logger = opts.logger || {info: console.log, error: console.log};
    let keep = opts.keep;
    let prefix = opts.prefix || 'gitlab';
    let dir = opts.dir|| Os.tmpDir();
    if (!cb)cb = function () {
    };
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function execute(path, idx) {
        if (idx == cmds.length) {
            if (!keep) {
                logger.info('Remove working directory: ' + path);
                Tmp.cleanup();
            } else {
                logger.info('Keep working directory: ' + path);
            }
            return cb();
        }
        let fname = Path.join(path, 'task-' + pad(idx, 3));
        Fs.writeFile(fname, cmds[idx], function (err) {
            if (err) {
                logger.error('File creation error: ' + err);
                return cb(err);
            }
            logger.info('File created: ' + fname);
            execFile(cmdshell, [fname], {cwd: path, env: process.env},
                function (err, stdout, stderr) {
                    if (err) {
                        logger.error('Exec error: ' + err);
                    } else {
                        logger.info('Executed: ' + cmdshell + ' ' + fname);
                        process.stdout.write(stdout);
                    }
                    process.stderr.write(stderr);
                    execute(path, ++idx);
                });
        });
    }

    logger.info('cmds: ' + inspect(cmds) + '\n');

    Tmp.mkdir({dir: dir, prefix: prefix}, function (err, path) {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        path = path;
        logger.info('Tempdir: ' + path);
        let i = 0;
        execute(path, i);
    });
}
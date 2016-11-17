/*
 Rolf Niepraschk (Rolf.Niepraschk@gmx.de)
 Inspired by https://github.com/nlf/node-github-hook
 */
"use strict";

let http = require('http');
let Util = require('util');
let inspect = Util.inspect;
let isArray = Util.isArray;
var execShellCmds =  require('./execShellCmds');
class GitLabHook {
    constructor(cfg, logger) {
        Object.assign(this, cfg);
        this.port = this.port || 3420;
        this.host = this.host || '0.0.0.0';
        this.cmdshell = this.cmdshell || '/bin/bash';
        this.logger = logger || {info: console.log, error: console.log};
        this.logger.info('self: ' + inspect(this) + '\n');
        this.server = http.createServer(this.serverHandler.bind(this));
    }

    listen(callback) {
        let self = this;
        if (!callback) {
            callback = function () {
                self.logger.info(Util.format(
                    'listening for gitlab events on %s:%d', self.host, self.port));
            }
        }
        self.server.listen(self.port, self.host, callback);
    }

    /**
     * http请求处理句柄
     * @param req
     * @param res
     * @returns {*}
     */
    serverHandler(req, res) {
        let self = this;
        let buffer = [];
        let bufferLength = 0;
        let failed = false;
        let remoteAddress = req.ip || req.socket.remoteAddress ||
            req.socket.socket.remoteAddress;
        let reply = function (statusCode, res) {
            let headers = {
                'Content-Length': 0
            };
            res.writeHead(statusCode, headers);
            res.end();
        }
        let parse = function (data) {
            let result;
            try {
                result = JSON.parse(data);
            } catch (e) {
                result = false;
            }
            return result;
        }
        req.on('data', function (chunk) {
            if (failed) return;
            buffer.push(chunk);
            bufferLength += chunk.length;
        });

        req.on('end', function (chunk) {
            if (failed) return;
            let data;

            if (chunk) {
                buffer.push(chunk);
                bufferLength += chunk.length;
            }

            self.logger.info(Util.format('received %d bytes from %s\n\n', bufferLength,
                remoteAddress));

            data = Buffer.concat(buffer, bufferLength).toString();
            data = parse(data);

            // invalid json
            if (!data || !data.repository || !data.repository.name) {
                self.logger.error(Util.format('received invalid data from %s, returning 400\n\n',
                    remoteAddress));
                return reply(400, res);
            }

            let repo = data.repository.name;

            reply(200, res);

            self.logger.info(Util.format('got event on %s:%s from %s\n\n', repo, data.ref,
                remoteAddress));
            self.logger.info(Util.inspect(data, {showHidden: true, depth: 10}) + '\n\n');
            let cmds = self.getCmds(self.tasks, remoteAddress, data);
            if (cmds.length === 0) {
                self.logger.info('No related commands for repository "' + repo + '"');
                return;
            }

            execShellCmds(cmds,{logger:self.logger,keep:self.keep,prefix:'gitlabhook'});

        });

        // 405 if the method is wrong
        if (req.method !== 'POST') {
            self.logger.error(Util.format('got invalid method from %s, returning 405',
                remoteAddress));
            failed = true;
            return reply(405, res);
        }
    }

    /**
     * 获取shell命令
     * @param tasks
     * @param data
     * @returns {Array}
     */
    getCmds(tasks, address, data) {
        let repo = data.repository.name;
        let lastCommit = data.commits ? data.commits[data.commits.length - 1] : null;
        let map = {
            '%r': repo,
            '%k': data.object_kind,
            '%g': data.repository ? data.repository.git_ssh_url : '',
            '%h': data.repository ? data.repository.git_http_url : '',
            '%u': data.user_name,
            '%b': data.ref,
            '%i': lastCommit ? lastCommit.id : '',
            '%t': lastCommit ? lastCommit.timestamp : '',
            '%m': lastCommit ? lastCommit.message : '',
            '%s': address
        }

        let ret = [], x = [];
        if (tasks.hasOwnProperty('*')) x.push(tasks['*']);
        if (tasks.hasOwnProperty(repo)) x.push(tasks[repo]);
        for (let i = 0; i < x.length; i++) {
            let cmdStr = (isArray(x[i])) ? x[i].join('\n') : x[i];
            for (let j in map) cmdStr = cmdStr.replace(new RegExp(j, 'g'), map[j]);
            ret.push(cmdStr + '\n');
        }
        return ret;
    }
}


module.exports = GitLabHook;


#!/usr/bin/env node
"use strict"

var logger = {
    info:  console.log,
    error: console.log,
};

var cfg = require('./config.js');
var Hook = require('./lib/gitlabhook');
var server = new Hook(cfg,logger);
server.listen();
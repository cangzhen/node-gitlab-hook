/**
 * Created by lcz on 16/11/16.
 */
"use strict"
var http = require('http');
var postData = require('./gitlab.message.js');
var string = JSON.stringify(postData);
var options = {
    hostname: 'localhost',
    port: 3420,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(string)
    }
};

var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(string);
req.end();

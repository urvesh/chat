/**
 * Created by Urvesh on 9/6/2015.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

exports.index = function(req, res, next) {
    res.render('chat');
};

exports.send = function(req, res, next) {
    console.log('hey');
    res.send('submited msg', res.query.m);

};
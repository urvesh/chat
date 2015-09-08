var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var controllers = require('./controllers/MainController');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/users', users);
app.get('/chat', controllers.index);



io.emit('some event', {
  for: 'everyone'
});


io.on('connection', function(socket) {
  console.log('a user connection');
  //socket.broadcast.emit('hi');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });


  socket.on('chat message', function(person, msg) {
    console.log('message:', msg, person);
    io.emit('chat message', msg);
  });

});


var server = http.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://127.0.0.1:%s', port);
  //console.log('Listening at http://%s:%s', host, port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;

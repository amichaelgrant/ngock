var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config     = require('./bin/config');

//using a common session store - redis for all //
//instances of the app running on different ports//
//part 1 of redis session store//
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 'loopback');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser( config.SECRET, {}));
app.use(express.static(path.join(__dirname, 'public')));

//part 2 of redis session store//
app.use(session({
    store: new RedisStore({ }),
    secret: 'this-is-a-very-secured--secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
//part 3 - in the event that the session to redis is lost//
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('Session store connection to redis lost')) // handle error
  }
  next();
});



app.use('/', routes);
app.use('/users', users);

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

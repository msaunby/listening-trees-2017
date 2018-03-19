var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

//var monitorPeer = require('./monitor-peer');
var monitorGet = require('./monitor-get');

var benches = require('./benches');

var fs = require('fs');
var isUseHTTPs = true;
var port = 8443;
var options = {
    key: fs.readFileSync("../ssl/key.pem"),
    cert: fs.readFileSync("../ssl/cert.pem")
};
var server = require(isUseHTTPs ? 'https' : 'http');

var app = express();

var messages={};

// My middleware
app.get('/monitor-set' ,function (req, res) {
  //monitorGet.refresh(req, res, benches);
  var msg = req.query['msg'];
  var reply = JSON.stringify({nodes:benches.nodes,links:benches.links,states:benches.state});
  if(msg){
    //console.log("msg", msg);
    if(msg.connectRequest){
      console.log("offer to", msg.connectRequest.to);
      for(var m in  msg.connectRequest.to){
        messages[ msg.connectRequest.to[m]] = msg;
      }
    }
    else if(msg.answer){
      console.log("answer for", msg.replyTo);
      messages[ msg.replyTo ] = msg;
    }
    else if(msg.id){
      console.log("id msg", msg);
      if(messages[msg.id]){
        reply = JSON.stringify(messages[msg.id]);
        console.log("HAVE A MESSAGE FOR YOU", reply);
        delete(messages[msg.id])
      }
    }
    else{
      console.log("other msg", msg);
    }
  }
  res.json( reply );
});

app.get('/add-node' ,function (req, res) {
  var msg = req.query['msg'];
  benches.addNode();
  benches.addLink();
  monitorGet.sendAll(JSON.stringify({nodes:benches.nodes,links:benches.links}));
  res.json({});
});

app.get('/node-connect' ,function (req, res) {
  var id = req.query['id'];
  var state = req.query['state'];
  console.log("node-connect id: " + id + ", state: " + state);
  if(id && state){
    benches.setState(id, state, false);
  }
  res.json(benches.state);
});

// This method is used for remote control of nodes.
app.get('/node-remote-update' ,function (req, res) {
  var id = req.query['id'];
  var state = req.query['state'];
  console.log("node-remote-update id: " + id + ", state: " + state);
  if(id && state){
    benches.setState(id, state, true);
  }
  res.json(benches.state);
});


// Create an HTTP service.
//http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
server.createServer(options, app).listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

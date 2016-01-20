var app = require('./class/app.js');
var user = require('./class/user.js');
var config = require('./config.js');
global.cryptoJs = require("crypto-js");

global.task = require('./class/task.js');
global.release = require('./class/release.js');
global.file = require('./class/file.js');
global.moment = require('./js/moment.min.js')

var app = new app()

var mysql      = require('mysql');
var connection = mysql.createConnection(config);
var express = require('express')
var appExpress = express();
var server = require('http').Server(appExpress);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser')

global.io = io

connection.connect();
global.connection = connection

server.listen(3000);
appExpress.use(cookieParser('$E5%gP1+r='));
appExpress.use("/css", express.static(__dirname + '/css'));
appExpress.use("/js", express.static(__dirname + '/js'));
appExpress.use("/img", express.static(__dirname + '/img'));

appExpress.get('/', function (req, res) {
  app.autoLogin(req, res)
  res.send(app.displayLogin())
});

var sqls = [
  "SELECT * FROM `type`",
  "SELECT * FROM `release`",
  "SELECT * FROM `user`",
  "SELECT * FROM `task_file`",
  "SELECT * FROM `task`"]
//console.log(sqls.join(";"))
connection.query(sqls.join(";"), function(err, r, fields) {
  if (err) throw err;
  

  var indexedTasks = []
  for (var i=0; i<r[4].length;i++){
    var t = r[4][i]
    indexedTasks[t.id] = t
  }
//console.log(indexedTasks)
//console.log(indexedTasks)
global.data = {taskTypes:r[0],releases:r[1],users:r[2],tasks_files:r[3],tasks:indexedTasks}
  

  for (var data of r[2]) {
    var u = new user(data)
    app.users.push(u)
    app.usersKey[u.getKey()] = u.id
  }
});  

io.on('connection', function (socket) {
  var u = null
  app.controller(socket)
  socket.emit('news', { hello: 'world' });
  socket.on('login', function (data) {
    u = app.login(new user(data))
    //console.log(u)
    var html = app.display(u)
    global.data.connectUserId = u.id
    socket.emit('logged',{logged:u.logged,html:html,data:global.data});
    io.emit('changeNbUser',app.getNbUserLogged());
  });
});


 
//connection.end();

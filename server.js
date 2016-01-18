var app = require('./class/app.js');
var user = require('./class/user.js');
var config = require('./config.js');

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

connection.connect();
global.connection = connection

server.listen(3000);

appExpress.use("/css", express.static(__dirname + '/css'));
appExpress.use("/js", express.static(__dirname + '/js'));
appExpress.use("/img", express.static(__dirname + '/img'));

appExpress.get('/', function (req, res) {
  res.send(app.displayLogin())
  //res.sendFile(__dirname + '/index.html');
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
  
  global.json = {taskTypes:r[0],releases:r[1],users:r[2],tasks_files:r[3],tasks:r[4]}

  for (var data of r[2]) {
    var u = new user(data)
    app.users.push(u)
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
    global.json.connectUserId = u.id
    socket.emit('logged',{logged:u.logged,html:html,data:global.json});
    io.emit('changeNbUser',app.getNbUserLogged());
  });
});


 
//connection.end();

var app = require('./class/app.js');
var user = require('./class/user.js');
var config = require('./config.js');

var app = new app()

var mysql      = require('mysql');
var connection = mysql.createConnection(config);
 
var express = require('express')
var appExpress = express();
var server = require('http').Server(appExpress);
var io = require('socket.io')(server);

server.listen(3000);

appExpress.use("/css", express.static(__dirname + '/css'));
appExpress.use("/js", express.static(__dirname + '/js'));
appExpress.use("/img", express.static(__dirname + '/img'));

appExpress.get('/', function (req, res) {
  res.send(app.displayLogin())
  //res.sendFile(__dirname + '/index.html');
});

connection.connect();
 
connection.query('SELECT * FROM user', function(err, rows, fields) {
  if (err) throw err;
  
  for (var data of rows) {
    var u = new user(data)
    app.users.push(u)
  }

  io.on('connection', function (socket) {
    
    socket.emit('news', { hello: 'world' });
    socket.on('login', function (data) {
      var u = app.login(new user(data))
      var html = app.display()
      socket.emit('logged',{logged:u.logged,html:html});
      io.emit('changeNbUser',app.getNbUserLogged());
    });
  });

});
 
connection.end();


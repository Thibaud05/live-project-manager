var app = require('./class/app.js');
var user = require('./class/user.js');

var app = new app()

var mysql      = require('mysql');
var connection = mysql.createConnection({
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  user     : 'root',
  password : 'root',
  database : 'lpm'
});
 
var express = require('express')
var appExpress = express();
var server = require('http').Server(appExpress);
var io = require('socket.io')(server);

server.listen(3000);

appExpress.use("/css", express.static(__dirname + '/css'));
appExpress.use("/js", express.static(__dirname + '/js'));

appExpress.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
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
      socket.emit('logged',u.logged);
      io.emit('changeNbUser',app.getNbUserLogged());
    });
  });

});
 
connection.end();


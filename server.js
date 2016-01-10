var user = require('./class/user.js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  user     : 'root',
  password : 'root',
  database : 'lpm'
});
 
var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));

app.get('/', function (req, res) {
  console.log("ok")
  res.sendFile(__dirname + '/index.html');
});


connection.connect();
 
connection.query('SELECT * FROM user', function(err, rows, fields) {
  if (err) throw err;
  
  var users = []
  for (var data of rows) {
    var u = new user(data)
    users.push(u)
  }

  io.on('connection', function (socket) {
    var u = new user()
    socket.emit('news', { hello: 'world' });
    socket.on('login', function (data) {
      login(data)
      console.log(data);
    });
  });

});
 
connection.end();

function login(){
  console.log(users)
}


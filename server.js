const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

var user = require('./class/user.js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'lpm'
});
 
connection.connect();
 
connection.query('SELECT * FROM user', function(err, rows, fields) {
  if (err) throw err;
  
 r (var data of rows) {
    var u = new user(data)
  }
});
 
connection.end();







http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('NOde js with ECMAScript 6\n');
}).listen(port, hostname, () => {
  console.log('Server running at http://' + hostname +':' + port +'/');
  //var u = new user();
});
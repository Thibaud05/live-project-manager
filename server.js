var app         = require('./class/app.js');
var user        = require('./class/user.js');
var config      = require('./config.js');

global.escapeQuote = function (str) {
  return str.replace(/\\([\s\S])|(')/g,"\\$1$2");
}

global.cryptoJs = require("crypto-js");
global.task     = require('./class/task.js');
global.type     = require('./class/type.js')
global.release  = require('./class/release.js');
global.file     = require('./class/file.js');
global.moment   = require('./js/moment.min.js')

var fs           = require("fs");
var mysql        = require('mysql');
var connection   = mysql.createConnection(config);
var express      = require('express')
var appExpress   = express();
var server       = require('http').Server(appExpress);
var io           = require('socket.io')(server);
var cookieParser = require('socket.io-cookie');
var fileUpload   = require('socketio-file-upload')
//var lwip         = require('lwip')

var app = new app()

io.use(cookieParser);
global.io = io
connection.connect();
global.connection = connection
global.config = config
server.listen(3000);

appExpress.use("/css", express.static(__dirname + '/css'));
appExpress.use("/js", express.static(__dirname + '/js'));
appExpress.use("/img", express.static(__dirname + '/img'));
appExpress.use("/files", express.static(__dirname + '/uploads'));

appExpress.use(fileUpload.router)

appExpress.get('/', function (req, res) {
  res.send(app.displayLogin())
});

appExpress.get('/uploadTest', function (req, res) {
  res.sendFile(__dirname + '/testupload.html');
});

var sqls = [
  "SELECT * FROM `type`",
  "SELECT * FROM `release`",
  "SELECT * FROM `user`",
  "SELECT * FROM `task_file`",
  "SELECT * FROM `task`",
  "SELECT * FROM `project`",
  "SELECT * FROM `project_user`"
  ]

connection.query(sqls.join(";"), function(err, r, fields) {
  if (err) throw err;
  var indexedTasks = indexById(r[4])
  var indexedReleases = indexById(r[1])
  var indexedTasksFiles = indexById(r[3])
  var indexedProjects = indexById(r[5])
  var indexedUsers = []
  for (var data of r[2]) {
    var u = new user(data)
    app.users.push(u)
    app.usersKey[u.getKey()] = u
    indexedUsers[u.id] = u
  }
  global.data = {
    taskTypes   : r[0],
    releases    : indexedReleases,
    users       : indexedUsers,
    tasks_files : indexedTasksFiles,
    tasks       : indexedTasks,
    projects    : indexedProjects,
    projects_user: r[6]
  }

});  

io.on('connection', function (socket) {
  console.log("conect")
  var u = null
  app.controller(socket)
  if(!app.autoLogin()){
    socket.emit('displayLogin',true);
  }
  socket.emit('news', { hello: 'world' });

  socket.on('login', function (data) 
  {
    u = app.login(new user(data))
    //console.log(u)
    var html = app.display(u)
    global.data.connectUserId = u.id
    socket.connectUserId = u.id
    var obj = {logged:u.logged,key:u.getKey(),html:html}
    socket.emit('logged',{obj:obj,data:global.data});
    if(u.logged){
      global.data.users[u.id].logged = true
      io.emit('loginUser',u.id);
    }
  });

  socket.on('disconnect', function ()
  {
    app.logout(socket.id)
  });

  var uploader = new fileUpload();
  uploader.dir = __dirname + "/uploads";
  uploader.listen(socket);

  socket.on('uploadAvatar', function (data)
  {
      var imgPath = __dirname + "/uploads/" +  data.title
      var userId = app.userBySocket[socket.id].id
      var imgPathThumb = __dirname + "/img/user/" + userId + ".jpg"
      /*
      lwip.open(imgPath, function(err, image){
        image.contain(96, 96,'white', function(err, image){     
             image.writeFile(imgPathThumb, function(err){
              fs.unlink(imgPath)
              console.log("ok run update")
              socket.emit('updateAvatar',{userId:userId})
            });
        });
      });
      */
  })

  uploader.on("saved", function(event)
  {
      console.log(event.file);

  });
  
  uploader.on("error", function(event)
  {
      console.log("Error from uploader", event);
  });
});

function indexById(data)
{
  var indexedData = []
  for (var i=0; i<data.length;i++){
    var obj = data[i]
    indexedData[obj.id] = obj
  }
  return indexedData
}
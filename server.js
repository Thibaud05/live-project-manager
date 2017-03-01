'use strict'
serverStart()
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
global.link     = require('./class/link.js');
global.message  = require('./class/message.js');
global.box      = require('./class/box.js');
global.moment   = require('./js/moment.min.js')
global.store    = require('./class/Store.js'); 

var ejs          = require('ejs')
var fs           = require("fs");
var mysql        = require('mysql');
var connection   = mysql.createConnection(config);
var express      = require('express')
var appExpress   = express();
var server       = require('http').Server(appExpress);
var io           = require('socket.io')(server);
var cookieParser = require('socket.io-cookie');
var fileUpload   = require('socketio-file-upload')

var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  pool:true,
  host: 'smtp.livepromanager.com',
  port: 587,
  tls: {
      rejectUnauthorized:false,
  },
  auth: {
      user: 'no-reply@livepromanager.com',
      pass: 'bz42ab69c'
  },
  maxConnections: 3,
  maxMessages: 300
});


var app = new app()

io.use(cookieParser);
global.io = io
connection.connect();
global.connection = connection
global.config = config
server.listen(3000);

appExpress.use('/favicon.ico', express.static('icon/favicon.ico'));
appExpress.use("/icon", express.static(__dirname + '/icon'));
appExpress.use("/css", express.static(__dirname + '/css'));
appExpress.use("/js", express.static(__dirname + '/js'));
appExpress.use("/img", express.static(__dirname + '/img'));
appExpress.use("/files", express.static(__dirname + '/uploads'));

appExpress.use(fileUpload.router)

appExpress.get('/forgotPassword', function (req, res) {
  res.send(app.displayForgotPassword())
});

appExpress.get('/resetPasword/:hash', function (req, res) {
  res.send(app.displaychangePassword(req.param('hash')))
});

appExpress.get('/', function (req, res) {
  res.send(app.displayLogin())
});

appExpress.get('/api/taskTitle/:id', function (req, res) {
  var json = [];
  req.param('id').split(",").forEach(function (id) {
    var task = global.store.tasks[parseInt(id)]
    if(task!=undefined){
      json.push({id:task.id,title:task.title})
    }
  });
  if(json != ""){
    res.send(JSON.stringify(json))
  }else{
    res.status(404).send('Not found');
  }
});

appExpress.get('/uploadTest', function (req, res) {
  res.sendFile(__dirname + '/testupload.html');
});


connection.query(global.store.getSql(), function(err, data, fields) {
  if (err) throw err;
  global.store.setData(data)
  for (var userData of global.store.users) {
      var u = new user(userData)
      app.users.push(u)
      app.usersKey[u.getKey()] = u
  }
  console.log("-- Mysql data Loaded")
});  

io.on('connection', function (socket) {
  console.log("conect")
  var u = null
  app.controller(socket)
  if(!app.autoLogin(socket)){
    socket.emit('displayLogin',true);
  }else{
    socket.emit('loading',{});
  }
  socket.emit('news', { hello: 'world' });

  socket.on('login', function (data)
  {
    u = app.login(new user(data),socket)
    //console.log(u)
    var html = app.display(u)
    socket.connectUserId = u.id
    var obj = {logged:u.logged,key:u.getKey(),html:html,connectUserId:u.id,selectedProject:u.selectedProject}
    socket.emit('logged',{obj:obj,data:global.store.getClientData(u.id)});
    if(u.logged){
        app.users[u.id].logged = true
      io.emit('loginUser',u.id);
    }
  });

  socket.on('disconnect', function ()
  {
    app.logout(socket)
  });


  socket.on('changePassword', function (data)
  {
    console.log(data)
    var hash = ""
    for (var user of app.users) {
      if( data.hash == user.resetPassword){
        user.changePassword(data.password)
        //user.saveKey(socket)
        hash = user.getKey()
        app.usersKey[u.getKey()] = user
      }
    }
    socket.emit('changePassword',hash);
  })


  socket.on('forgotPassword', function (email)
  {
    var haveAccount = false;
    var fp_user = app.getUserByEmail(email)
    
    if(fp_user){
      haveAccount = true;
      socket.emit('forgotPassword',true);
      var hash = fp_user.startResetPassword()
      var emailTemplate = fs.readFileSync(__dirname + '/emails/resetPassword.ejs', 'utf8')
      var body = ejs.render(emailTemplate,{hash:hash}); 
      var mail_object = {
          from: '"LPM" no-reply@livepromanager.com',
          to: email,
          subject: 'Changer de mot de passe !', 
          text: 'Suivez le lien http://livepromanager.com/resetPassword/'+ hash +' pour changer votre mot de passe.',
          html: body
      };
      
      transport.sendMail(mail_object, function(error, info){
          if(error) {
              console.log(error.response);
          }
          socket.emit('forgotPasswordMail');
      });
    }else{
      socket.emit('forgotPassword',false);
    }
    
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

global.moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

function serverStart(){
  console.log("//////////////////////////////")
  console.log("//                          //")
  console.log("//     Server start         //")
  console.log("//                          //")
  console.log("//////////////////////////////")
}
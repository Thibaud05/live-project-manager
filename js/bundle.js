/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var socket = __webpack_require__(1);
	var tasksManager = __webpack_require__(3);
	var tm = new tasksManager();
	window.tm = tm

	$(function () {

	  $('.form-signin').css({ opacity: 0 ,marginTop: "0px"})
	    $('.form-signin').on('submit', function(e) {
	        e.preventDefault();
	 
	        var $this = $(this);
	 
	        var email = $('#inputEmail').val();
	        var password = $('#inputPassword').val();
	        socket.emit('login', { "email":email , "password":password });
	    });
	});

	socket.on('notif', function (data) {
	  var options = {
	      body: data.body,
	      icon: data.icon,
	      tag: data.tag
	  }
	  if(tm.isUserDisplay(data.userId)){
	    if (!("Notification" in window)) {
	      alert("Ce navigateur ne supporte pas les notifications desktop");
	    }
	    else if (Notification.permission === "granted") {
	      var notification = new Notification(data.title,options);
	    }
	    else if (Notification.permission !== 'denied') {
	      Notification.requestPermission(function (permission) {
	        if(!('permission' in Notification)) {
	          Notification.permission = permission;
	        }
	        if (permission === "granted") {
	          var notification = new Notification(data.title,options);
	        }
	      });
	    }
	  }
	});

	socket.on('displayLogin', function (data) {
	  $('.form-signin').animate({opacity: 1,marginTop: "150px"},{
	    duration: 500,
	    easing: "easeOutCubic"
	  })
	})

	socket.on('logged', function (json) {
	  var data = json.obj
	    if(data.logged){
	      createCookie("key", data.key,30)
	      if(data.autoLog){
	            $('.form-signin').remove()
	            $('body').html(data.html)
	            $('.strip').css({ "margin-left": "-200px",opacity:0})
	            $('.bar').css({ opacity: 0 ,top:-50})
	            $('.bar').animate({opacity: 1,top: 0},{
	              duration: 500,
	              easing: "easeOutCubic",
	              complete: function() {
	                appInit(json.data)
	              }
	            })
	      }else{
	        $('.form-signin').animate({opacity: 0, marginTop: "0px"},{
	          duration: 500,
	          easing: "easeOutCubic",
	          complete: function() {
	            $('body').html(data.html)
	            $('.strip').css({ "margin-left": "-200px",opacity:0})
	            $('.bar').css({ opacity: 0 ,top:-50})
	            $('.bar').animate({opacity: 1,top: 0},{
	              duration: 500,
	              easing: "easeOutCubic",
	              complete: function() {
	                appInit(json.data)
	              }
	            })
	          }
	        });   
	    }
	    }else{
	      $('.form-signin').effect( "shake" );
	      $("#inputPassword").val('').focus();
	    }
	})

	socket.on('loginUser', function (id_user) {
	  if( tm.users[id_user] != undefined){
	    tm.users[id_user].logged = true
	    var cible = $(".avatar" + id_user).parent().find(".glyphicon")
	   	cible.removeClass("glyphicon-remove-sign")
	   	cible.addClass("glyphicon-ok-sign")
	  }
	})

	socket.on('logoutUser', function (id_user) {
	  tm.users[id_user].logged = false
	    var cible = $(".avatar" + id_user).parent().find(".glyphicon")
	   cible.removeClass("glyphicon-ok-sign")
	   cible.addClass("glyphicon-remove-sign")
	})


	moment.locale('fr', {
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
	var debug = true;
	function log(msg){
	  if(debug){
	    console.log(msg);
	  }
	} 
	function appInit(data) {
	  console.log("init")

	  ////////////////////////////////////////////
	  //
	  //  EVENT MANAGEMEMENT
	  //
	  ////////////////////////////////////////////
	  tm.init()
	  tm.getData(data)
	  tm.render()
	  tm.activate()
	  tm.sockets()
	  tm.disabledTaskBtn(true)
	  $('.box').css({"margin-top": "-20px",opacity:0})
	  $('.strip').animate({"margin-left": "0",opacity:1},{duration: 500, easing:"easeOutCubic",
	    complete: function() {

	      $('#tasksManager').css({"margin-top": "-200px",opacity:0})
	      $('#tasksManager').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic",
	        complete: function() {
	          
	          $('.box').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic"})

	        }
	      })
	    }
	  })


	  //////////////////////
	  // Week navigation

	   $( "#prev" ).click(function() {
	    tm.changeInterval(-1);
	    $( this ).blur()
	   });
	   $( "#next" ).click(function() {
	    tm.changeInterval(1);
	    $( this ).blur()
	   }); 

	  //////////////////////
	  // Remove selected task
	  var searchIsOpen = false 
	   $( "#search_btn" ).click(function() {
	    if(searchIsOpen){
	      $( "#search" ).hide()
	      $(".page").css("padding-top","141px")
	      searchIsOpen = false
	    }else{
	      $( "#search" ).show()
	      $(".page").css("padding-top","187px")
	      searchIsOpen = true
	    }
	    $( this ).blur()
	   });


	  //////////////////////
	  // Remove selected task

	  $("#del_btn").mousedown(function() {
	      tm.delSelectedTasks();
	  });
	  $( "#del_btn" ).click(function() {
	    $( this ).blur()
	  }); 

	  $("#archive_btn").mousedown(function() {
	    if (confirm("Voulez-vous archiver cette tache ?")) {
	      tm.archiveSelectedTasks();
	    }
	  });
	  $( "#archive_btn" ).click(function() {
	    $( this ).blur()
	  }); 

	  $('html').keydown(function(e){
	      if(e.keyCode == 46){
	          tm.delSelectedTasks();
	      }
	  }) 

	  $( "#next" ).after( tm.getProjects());

	  tm.btnProjectHandler();

	/*
	  $("#projects").on('mousedown', 'li a', function(){
	    var idProject = $(this).data('value')
	    tm.toogleProject(idProject)
	    $(this).children( ".glyphicon" ).toggleClass("glyphicon-eye-close").toggleClass("glyphicon-eye-open")
	  });

	*/

	  //////////////////////
	  // Accountable selected task
	  $("#dropdownAccountable").mousedown(function() {
	    tm.select = true;
	  });

	  //////////////////////
	  // Duplicate selected task

	   $( "#duplicate_btn" ).mousedown(function() {
	    tm.duplicateTask()
	  }); 

	  $( "#duplicate_btn" ).click(function() {
	    $( this ).blur()
	  }); 

	  //////////////////////
	  // valid selected task

	   $( "#valid_btn" ).mousedown(function() {
	    tm.validTask()
	  }); 

	  $( "#valid_btn" ).click(function() {
	    $( this ).blur()
	  }); 

	  //////////////////////
	  // Add a new task

	  $('.dropdown-menu').find('form').click(function (e) {
	    e.stopPropagation();
	  });
	  $('#dropdownAdd').on('hide.bs.dropdown', function () {
	    $('#add_task').toggleClass("hidden",true)
	    $('#add_release').toggleClass("hidden",true)
	    $('#add_type').toggleClass("hidden",true)
	  })
	    

	  $( "#add_btn_task" ).click(function(e) {
	    e.stopPropagation();
	    $('#add_task .form-type option').remove();
	    $('#add_task .form-type').html(tm.getTypeList());
	    $('#add_task').toggleClass("hidden")
	    $('#add_release').toggleClass("hidden",true)
	    $('#add_type').toggleClass("hidden",true)
	  }); 

	  $('#add_btn_release').click(function (e) {
	    e.stopPropagation();
	    $('#add_release .form-type option').remove();
	    $('#add_release .form-type').html(tm.getTypeList());
	    $('#add_release').toggleClass("hidden")
	    $('#add_task').toggleClass("hidden",true)
	    $('#add_type').toggleClass("hidden",true)
	  });

	  $('#add_btn_type').click(function (e) {
	    e.stopPropagation();
	    $('#add_type').toggleClass("hidden")
	    $('#add_task').toggleClass("hidden",true)
	    $('#add_release').toggleClass("hidden",true)
	  });

	 $('#add_task a').click(function (e) {
	  var type = $('#add_task .form-type').val()
	  tm.newTask(type);
	  $('#dropdownAdd').toggleClass("open",false)
	  $('#add_task').toggleClass("hidden",true)
	 })

	 $('#add_type a').click(function (e) {
	  var name = $('#add_type input').val()
	  var color = $('#add_type .color').val()
	  socket.emit('addRelease', {name:name,color:color,id_project:tm.selectedProject});
	 })

	//
	 $('#add_release a').click(function (e) {
	  var name = $('#add_release input').val()
	  var typeId = $('#add_release .form-type').val()
	  socket.emit('addDeadLine', {name:name,typeId:typeId});
	 })



	  var delay = (function(){
	    var timer = 0;
	    return function(callback, ms){
	      clearTimeout (timer);
	      timer = setTimeout(callback, ms);
	    };
	  })();

	  //////////////////////
	  // Search engine

	  $('#searchField').keyup(function() {
	      var field = $(this)
	      delay(function(){
	        tm.search(field.val())
	      }, 400 );
	  });

	  $('#logout').click(function (e) {
	    e.stopPropagation();
	    createCookie("key","",-1)
	    document.location.href=""
	  });

	  $('#btnConfig').click(function (e) {
	    e.stopPropagation();
	    $('#config').show();
	  });

	  $('#editAvatar').click(function (e) {
	    e.stopPropagation();
	    console.log("ooo")
	    //
	    var avatarUpload = new SocketIOFileUpload(socket);

	    avatarUpload.prompt()

	    $('#user > a').dropdown('toggle')

	    avatarUpload.addEventListener("progress", function(event){
	        var percent = event.bytesLoaded / event.file.size * 100;
	        $('#editAvatar .progressBar').css('width',percent + '%');
	    });

	    avatarUpload.addEventListener("complete", function(event){
	       if(event.success){
	          socket.emit('uploadAvatar', {title:event.file.name,type:event.file.type});
	           $('#editAvatar .progressBar').delay(800).queue(function (next) {
	              $(this).css('width',0);
	                next();
	              });
	          }
	          avatarUpload.destroy();
	          avatarUpload = null;
	    })
	  });

	};

	function createCookie(name, value, days) {
	    var expires;

	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();
	    } else {
	        expires = "";
	    }
	    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	}

	String.prototype.contain = function (str) {
	    return this.toLowerCase().indexOf(str.toLowerCase()) > -1
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(2);
	var instance = null;
	class socket{  
	    constructor() {
	        if(!instance){
	              instance = io.connect(config.host);
	        }
	        return instance;
	      }
	}
	module.exports = new socket();

/***/ },
/* 2 */
/***/ function(module, exports) {

	var host = 'http://www.koolog.com:3000';

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var socket = __webpack_require__(1);
	window.socket = socket
	var user = __webpack_require__(4);
	var file = __webpack_require__(5);
	var link = __webpack_require__(6);
	var task = __webpack_require__(7);
	var projectScreen = __webpack_require__(10);
	var message = __webpack_require__(9);
	var box = __webpack_require__(13);
	var TaskList = __webpack_require__(15);
	var BoxList = __webpack_require__(14);
	class tasksManager{
	  constructor(){
	      this.userByProject = [];
	      this.projectByUser = [];
	      this.projectById = []
	      this.users = [];
	      this.releases = [];
	      this.releasesById = [];
	      this.nbWeekPerScreen = 3;
	      this.dayPerWeek = 5;
	      this.nbdays = this.nbWeekPerScreen*this.dayPerWeek;
	      this.days = ["L","M","M","J","V","S","D"];
	      this.now = moment();
	      this.week;
	      this.firstDayWeek;
	      this.dates;
	      this.datesIndex
	      this.offset;
	      this.selectedTasks = {};
	      this.connectUserId;
	      this.connectUser;
	      this.fullUrl;
	      this.select = false;
	      this.lastRelease = []
	      this.searchValue = "";
	      this.projectsId = {}
	      this.projectIsOpen = false;
	      this.taskList = new TaskList()
	      this.boxList = new BoxList()
	  }
	  init(){
	    this.week = this.now.week();
	    this.firstDayWeek = this.now.day(1);
	    this.dates = [];
	    this.datesIndex = [];
	    this.datesIndex["0000-00-00"] = -1;
	    for (var i = 0; i < this.nbdays; i++){
	      var offset = Math.floor(i / this.dayPerWeek);
	      offset = offset * (7-this.dayPerWeek);
	      var d = this.firstDayWeek.clone().add(i + offset,'d').format('YYYY-MM-DD');
	      this.dates[i] = d
	      this.datesIndex[d] = i
	    }
	  }
	/**
	 *
	 * LOAD DATA
	 *
	 */
	  getData(data){
	    //console.log(data)
	      this.connectUserId = data.connectUserId;
	      this.fullUrl = data.fullUrl;
	      this.taskList.tasks = [];
	      var self = this
	      data.users.map(function(data,key) {
	        if(data!=undefined){
	          self.users[data.id] = new user(data)
	        }
	      })
	      this.connectUser = this.getUser(this.connectUserId)
	      this.taskList.setData(data)



	      //console.log(tasks_files)

	      data.projects.map(function(project,key) {
	        if(project!=undefined){
	          self.projectById[project.id] = project;
	        }
	      });

	      data.projects_user.map(function(pu,key) {

	        if(self.userByProject[pu.id_project] == undefined ){
	            self.userByProject[pu.id_project] = [];
	        }
	        self.userByProject[pu.id_project].push(pu.id_user)

	        if(self.projectByUser[pu.id_user] == undefined ){
	            self.projectByUser[pu.id_user] = [];
	        }
	        self.projectByUser[pu.id_user].push(pu.id_project)
	      });

	      self.releases = []
	      data.releases.map(function(data,key) {
	        if(data!=undefined){
	          var r = data
	          r.day = moment(data.day).format('YYYY-MM-DD');
	          r.id_project = self.taskList.taskTypes[r.typeId].id_project;

	          if (self.releases[r.day] == undefined){
	            self.releases[r.day] = new Array();
	          }
	          self.releases[r.day].push(r);
	          self.releasesById[r.id] = r;

	          if(self.lastRelease[r.typeId]!=undefined){
	            if(moment(r.day)>moment(self.lastRelease[r.typeId].day) && moment(r.day)<moment()){
	               self.lastRelease[r.typeId] = r;
	            }
	          }else{
	            if(moment(r.day)<moment()){
	              self.lastRelease[r.typeId] = r;
	            }
	          }
	        }
	      });
	      this.selectProject(data.selectedProject)
	    
	    self.projectByUser[self.connectUser.id].map(function(projectId,key) {
	      self.projectsId[projectId] = true
	      if(self.selectedProject == projectId){
	        self.userByProject[projectId].map(function(userId,key) {
	            self.users[userId].display = true
	        })
	      }
	    });
	    this.boxList.setData(data.box)
	  }

	/**
	 *
	 * get the next release
	 *
	 */
	  getNextRelease(typeId,getPrev){
	    var maxRelease = {}
	    self = this
	    this.releasesById.map(function(r,key){
	      if (r){
	        if(r.id_project == self.selectedProject){
	          if(maxRelease[r.typeId]!=undefined){
	            if(maxRelease[r.typeId] < r.day){
	              maxRelease[r.typeId] = r.day
	            }
	          }else{
	            maxRelease[r.typeId] = r.day
	          }
	        }
	      }
	    })
	    var actualReleaseDate = maxRelease[typeId]
	    var nextRelease = {}
	    for (var id in maxRelease) {
	      var releaseDate = maxRelease[id]
	      if(getPrev){
	        if(moment(releaseDate)<moment(actualReleaseDate)){
	              //console.log(releaseDate)
	          if(nextRelease.id == undefined || moment(releaseDate)>moment(nextRelease.day)){
	            nextRelease = {"id":id,"day":releaseDate}
	          }
	        }
	      }else{
	        if(moment(releaseDate)>moment(actualReleaseDate)){
	              //console.log(releaseDate)
	          if(nextRelease.id == undefined || moment(releaseDate)<moment(nextRelease.day)){
	            nextRelease = {"id":id,"day":releaseDate}
	          }
	        }
	      }


	    }
	    if(nextRelease.id== undefined){
	      return false
	    }else{
	      return nextRelease.id
	    }
	  }
	/**
	 *
	 * SYNCRONISE DATA
	 *
	 */
	  sync(){

	    var self = this
	    this.taskList.tasks = [];


	    $.each( this.users, function( key, user ) {
	      if(user){
	        user.display = false
	      }
	    })
	    self.projectByUser[self.connectUser.id].map(function(projectId,key) {
	      if(self.selectedProject == projectId){
	        self.userByProject[projectId].map(function(userId,key) {
	            self.users[userId].display = true
	        })
	      }
	    });

	    this.taskList.tasks = [];
	    this.taskList.tasksById.map(function(t,key) {
	      if (t){
	        t.isLocked = (self.selectedProject != t.id_project)
	        var display = true;
	        if(self.searchValue != ""){
	          display = false;
	          if((t.title.contain(self.searchValue))||(t.description.contain(self.searchValue))){
	            display = true;
	          }
	        }
	        if(display){
	          var k = t.userId + ":" + t.day;
	          if(self.taskList.tasks[k] == undefined ){
	            self.taskList.tasks[k] = new Array();
	          }
	          self.taskList.tasks[k][t.priority] = t;
	        }
	      }
	    });

	    this.releases = [];
	    this.releasesById.map(function(release,key) {
	      if (release){
	        var k =  release.day;
	        if(self.releases[k] == undefined ){
	          self.releases[k] = new Array();
	        }
	        self.releases[k].push(release);
	      }
	    });

	  }
	/**
	 *
	 * GET USER
	 *
	 */
	  getUser(id){
	    if(this.users[id] != undefined) {
	      return this.users[id];
	    }
	  }
	/**
	 *
	 * GET LAST RELEASE
	 *
	 */
	  getLastRelease(typeId){
	    var r = this.lastRelease[typeId]
	    if(r != undefined && r.name != "α") {
	      return r.name;
	    }else{
	      return "ALPHA";
	    }
	  }
	/**
	 *
	 * ADD TASK
	 *
	 */
	  addTask(t){
	    t.id_project = this.taskList.taskTypes[t.typeId].id_project
	    t.isLocked = (this.selectedProject != t.id_project)

	    this.addDOMTask(t);
	    this.taskList.tasksById[t.id] = t;
	    this.activate();
	  }
	/**
	 *
	 * ADD MANY TASKS
	 *
	 */
	  addTasks(datas){
	    var self = this
	    datas.map(function( data, key ) {
	      var t = new task(data)
	      self.addDOMTask(t);
	      self.taskList.tasksById[t.id] = t;
	    });
	    this.activate();
	  }
	/**
	 *
	 * SAVE INDICATOR
	 *
	 */
	  save(){
	    var html =  '<div class="dataSaved">'
	    html +=       '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'
	    html +=     '</div>'
	    $( "body" ).append(html);
	    $(".dataSaved").animate({opacity:1}).animate({opacity:0},400,function() {
	      $(".dataSaved").remove();
	    });
	  }
	/**
	 *
	 * SEARCH ENGINE 
	 *
	 */
	  search(value){
	    this.searchValue = value;
	    this.init();
	    this.sync();
	    this.render();
	    this.activate();
	  }
	/**
	 *
	 * CREATE A NEW TASK
	 *
	 */
	  newTask(type){
	    var userId = this.connectUserId
	    var day = this.dates[0]
	    var lowPriority = 0
	    if (this.taskList.tasks[userId + ":" + day]!=undefined){
	      lowPriority =  this.taskList.tasks[userId + ":" + day].length;
	    }

	    var newTask = {
	      "id"                : "",
	      "userId"            : userId,
	      "title"             : "New task",
	      "typeId"            : type,
	      "day"               : day,
	      "description"       : "",
	      "creationUserId"    : userId,
	      "priority"          : lowPriority,
	      "accountableUserId" : userId,
	      "creationDate"      : "",
	      "valid"             : false
	    };
	    socket.emit('addTask', newTask);
	  }
	/**
	 *
	 * Delete selected task
	 *
	 */
	  delSelectedTasks(){
	    var removedTasksId = [];
	    var self = this
	    var oneTaskIsOpen = false
	    $.each(self.selectedTasks, function( key, t ) {
	      var id = t.attr("tid");
	      var task =  self.taskList.tasksById[id];
	      
	      if(!task.isOpen){
	        removedTasksId.push({"id":id,"id_user":"","title":"","typeId":"","day":""});
	      }else{
	        oneTaskIsOpen = true
	      }
	    });
	    if(!oneTaskIsOpen&&confirm("Voulez-vous supprimer cette tache ?")){
	      socket.emit('delTask', removedTasksId);
	    }
	  }
	/**
	 *
	 * Duplicte task
	 *
	 */
	    duplicateTask(){
	      var duplicatedTasksId = [];
	      for (var key in this.selectedTasks) {
	        var t = this.taskList.tasksById[key]
	        var lowPriority =  this.taskList.tasks[t.userId + ":" + t.day].length;
	        duplicatedTasksId.push({
	          "id"               : "",
	          "userId"            : t.userId,
	          "id_project"        : t.id_project,
	          "title"             : t.title,
	          "typeId"            : t.typeId,
	          "day"               : t.day,
	          "description"       : t.description,
	          "creationUserId"    : this.connectUserId,
	          "priority"          : lowPriority,
	          "accountableUserId" : t.userId,
	          "creationDate"      : "",
	          "valid"             : false
	        });
	      }
	      socket.emit('duplicateTask', duplicatedTasksId);
	    }
	/**
	 *
	 * Valid task
	 *
	 */
	    validTask(){
	      var validTasks = [];
	      for (var key in this.selectedTasks) {
	        var t = this.taskList.tasksById[key]
	        this.selectedTasks[key].find( ".ok" ).toggleClass("hidden")
	        t.valid = t.valid==1?0:1
	        this.taskList.tasksById[key] = t
	        validTasks.push(t);
	      }
	      socket.emit('updateTask', validTasks);
	    }
	/**
	 *
	 * Add task to the DOM
	 *
	 */
	    addDOMTask(t){
	        var k = t.userId + ":" + t.day
	        if(this.taskList.tasks[k] == undefined ){
	          this.taskList.tasks[k] = new Array();
	        }

	        this.taskList.tasks[k][t.priority] = t;
	        var selectedTask = $(".task[tid="+ t.id +"]")
	        var cible = $(".connectedSortable[di="+ this.datesIndex[t.day] +"][uid="+ t.userId +"]")
	        if (selectedTask.length && !cible.length) {
	          if(t.isOpen){
	            selectedTask.children("textarea").blur()
	            t.close(selectedTask)
	          }
	          selectedTask.remove()
	        }
	        if (selectedTask.length && cible.length) {
	          if(t.isOpen){
	            selectedTask.children("textarea").blur()
	            t.close(selectedTask)
	          }
	          selectedTask.remove()
	          cible.append(selectedTask)
	        }

	        if (!selectedTask.length && cible.length) {

	          var inBox = cible.parents('div.box').length > 0
	          var htmlTask = this.taskList.renderTask(t,inBox);
	          cible.append(htmlTask)
	        }
	    }
	/**
	 *
	 * Archive task
	 *
	 */
	    archiveSelectedTasks(){
	      var archivedTasks = [];
	      for (var key in this.selectedTasks) {
	        var t = this.taskList.tasksById[key]
	        var id = t.id
	        t.userId = 5
	        t.day = '0000-00-00'
	        archivedTasks.push(t);
	        this.selectedTasks[key].remove();
	        delete this.selectedTasks[id];
	      }
	      socket.emit('archiveTask', archivedTasks);
	    }

	/*----------  assign Accountable TASK  ----------*/
	    assignAccountable(userId){
	      var assignTasks = [];
	      for (var key in this.selectedTasks) {
	        var t = this.taskList.tasksById[key]
	        t.creationUserId = userId
	        this.taskList.tasksById[key] = t
	        assignTasks.push(t);
	      }
	      socket.emit('updateTask', assignTasks);
	    }

	    renderAccountable(){
	        var html = ''
	        for (var userId of this.userByProject[this.selectedProject]) {
	            var user = this.users[userId]
	            html += '<li><a href="#" data-value="' + user.id + '">' + user.getName() + '</a></li>'
	        }
	        return html
	    }
	/**
	 *
	 * DISPLAY RELEASES
	 *
	 */
	    renderReleases(key){
	      var html = ''
	      var tabRelease = this.releases[key];
	      if(tabRelease){
	        for (var i = 0; i < tabRelease.length; i++){
	          var r = tabRelease[i];
	          if(r!=undefined){
	            if(r.id_project == this.selectedProject){
	              html += this.renderRelease(r)
	            }
	          }
	        } 
	      }
	      return html;
	    }
	/**
	 *
	 * DISPLAY RELEASE
	 *
	 */
	    renderRelease(release){
	      var html = ''
	      var taskType = this.taskList.taskTypes[release.typeId];
	      if(taskType){
	        html += '<li class="ui-state-default release ' + taskType.color + '" tid = "' + release.id + '" ><span>';
	        html += '<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> ';
	        html +=  taskType.name + ' ' + release.name;
	        html += ' <span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>';
	        html +=  '</span></li>';
	      }
	      return html;
	    }
	/**
	 *
	 * DISPLAY BOX
	 *
	 */


	/**
	 *
	 * DISPLAY COMPONANT
	 *
	 */
	    render(){
	      var self = this;
	      var html = "";
	      var htmlHead = "";

	/*----------  Week row  ----------*/
	      htmlHead += '<tr class="week"><td class="firstCol"></td>';
	      for (i = 0; i < this.nbWeekPerScreen; i++){
	        htmlHead += '<td class="leftSep" colspan="' + this.dayPerWeek + '">W' + (i + this.week) + '</td>';
	      }
	      htmlHead += "</tr>";

	/*----------  Realeases row  ----------*/
	      htmlHead += '<tr class="day"><td></td>';
	      for (var i = 0; i < this.nbdays; i++){
	        var index = i % this.dayPerWeek;
	        var css = ( index==0 ) ? 'leftSep' : '';
	        htmlHead += '<td  class="' + css + '">'
	        htmlHead +=   '<ul class="releaseSlot" di = "' + i + '">' + this.renderReleases(this.dates[i]) + '</ul>'
	        htmlHead += '</td>'
	      }
	      htmlHead += "</tr>";

	/*----------  Days row  ----------*/
	      htmlHead += '<tr class="day"><td></td>';
	      for (var i = 0; i < this.nbdays; i++){
	        var index = i % this.dayPerWeek;
	        var css = ( index==0 ) ? ' class="leftSep"' : '';
	        var day = moment(this.dates[i],'YYYY-MM-DD');
	        htmlHead += '<td' + css + ' title="' + day.format('DD-MM-YYYY') + '">' + this.days[index] + '</td>';
	      }
	      htmlHead += "</tr>";

	/*----------  Rows tasks  ----------*/
	      var lines = "";
	      var firstLine = "";
	      $.each( this.users, function( key, user ) {
	        if(user && user.display){
	          var empltyLine = true
	          var line  = "<tr>";
	          line += '<td class="firstCol" >' + user.getAvatar(32) + user.getStatus() + user.firstName + '</td>';
	          for (i = 0; i < self.nbdays; i++){
	            var index = i % self.dayPerWeek;
	            var css = ( index==0 ) ? ' class="leftSep"' : '';
	            line += '<td' + css + '><ul class="connectedSortable" di = "' + i + '" uid ="'+ user.id +'">';

	            var htmlTask = self.taskList.render(user.id + ":" + self.dates[i],false);
	            if(htmlTask != ""){
	              empltyLine = false
	              line += htmlTask;
	            }
	            line += '</div></td>';
	          }
	          line += "</tr>";
	          if(self.searchValue == "" || !empltyLine){
	            if(user.id == self.connectUserId){
	              firstLine = line;
	            }else{
	              lines += line;
	            }
	          }
	        }
	      });
	      html += firstLine;
	      if(this.connectUser.level!=0){
	        html += lines;
	      }
	      $("#tasksManagerHead").html('<table class="table" width="100%" cellspacing="0">' + htmlHead + '</table>');
	      $("#tasksManager").html('<table class="table" width="100%" cellspacing="0">' + html + '</table>');
	      var htmlBox = ""

	      var htmlBox = this.boxList.render(this.selectedProject)

	      $("#box").html(htmlBox);
	      $("#accountable").html(this.renderAccountable());
	    }

	/**
	 *
	 * Sockets
	 * Get all event from the server
	 *
	 */
	    sockets(){
	      var self = this
	/*----------  moveTask ----------*/
	      socket.on('moveTask', function (data)
	      {
	        var t = self.taskList.tasksById[data.id]
	        t.update(data)
	        self.addDOMTask(t);
	        self.taskList.tasksById[t.id] = t;
	        self.activate();
	      })

	/*----------  setData  ----------*/
	      socket.on('setData', function (data)
	      {
	        var t = self.taskList.tasksById[data.id];
	        t.update(data)
	        var k = t.userId + ":" + t.day
	        var selectedTask = $(".task[tid="+ t.id +"]")

	        if (selectedTask) {
	          selectedTask.find( ".title" ).html(t.getTitle())
	          selectedTask.find( ".desc" ).html(t.getDescription())
	        }
	        self.taskList.tasksById[t.id].title = t.title;
	        self.taskList.tasksById[t.id].description = t.description;
	        if(self.taskList.tasks[k] == undefined ){
	          self.taskList.tasks[k] = new Array();
	        }
	        self.taskList.tasks[k][t.priority] = self.taskList.tasksById[t.id];
	      })

	/*----------  setRelease  ----------*/
	      socket.on('setRelease', function (data)
	      {
	          var r = self.releasesById[data.id];
	          if(self.releases[data.day] == undefined){
	            self.releases[data.day] = new Array();
	          }
	          self.releases[data.day].push(r);
	          r.day = data.day;
	          var selectedRelease = $(".release[tid="+ r.id +"]")
	          if(selectedRelease){
	            selectedRelease.remove()
	          }
	          var cible = $(".releaseSlot[di="+ self.datesIndex[r.day] +"]")
	          if(cible){
	            var htmlRelease = self.renderRelease(r);
	            cible.append(htmlRelease)
	          }
	      })

	/*----------  delTask ----------*/
	      socket.on('delTask', function (id)
	      {
	        var t =  self.taskList.tasksById[id];
	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if (selectedTask) {
	          selectedTask.remove();
	        }
	        delete self.taskList.tasksById[id];
	        delete self.selectedTasks[id];

	        log("taskRemoved");
	      })

	/*----------  duplicateTask ----------*/
	      socket.on('duplicateTask', function (data)
	      {
	        data.id_project = self.taskList.taskTypes[data.typeId].id_project;
	        var t = new task(data);
	        tm.addTask(t);
	      })

	/*----------  addTask  ----------*/
	      socket.on('addTask', function (data)
	      {
	        var t = new task(data);
	        tm.addTask(t);
	      })

	/*----------  updateTask ----------*/
	      socket.on('updateTask', function (data)
	      {
	        data.id_project = self.taskList.taskTypes[data.typeId].id_project;
	        var t = self.taskList.tasksById[data.id];
	        t.update(data)

	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if (selectedTask) {
	          if(t.valid == 0){
	            selectedTask.find( ".ok" ).addClass("hidden")
	          }else{
	            selectedTask.find( ".ok" ).removeClass("hidden")
	          }
	        }
	        self.taskList.tasksById[t.id].valid = t.valid
	      })

	/*----------  archiveTask ----------*/
	      socket.on('archiveTask', function (data)
	      {
	        var t = self.taskList.tasksById[data.id];
	        t.update(data)
	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if (selectedTask) {
	          selectedTask.remove();
	        }
	        self.taskList.tasksById[t.id] = t
	      })

	/*----------  delDataFiles  ----------*/
	      socket.on('delDataFiles', function (data)
	      {
	        var id = data.id
	        var selectedFile = $(".file > a[fid=" + id + "]").parent()
	        if (selectedFile) {
	          selectedFile.remove();
	        }
	        delete self.taskList.tasksById[data.taskId].files[id]
	      })

	/*----------  setDataFiles  ----------*/
	      socket.on('setDataFiles',function(data)
	      {
	        var f = new file(data)
	        var divFiles = $(".task[tid=" + f.taskId + "] .files")
	        if(divFiles){
	          divFiles.append(f.display())
	          self.taskList.tasksById[f.taskId].removeFile();
	        }
	        self.taskList.tasksById[f.taskId].files[f.id] = f
	      })
	/*----------  delDataLinks  ----------*/
	      socket.on('delDataLinks', function (data)
	      {
	        var id = data.id
	        var selectedLink = $(".link > a[lid=" + id + "]").parent()
	        if (selectedLink) {
	          selectedLink.remove();
	        }
	        delete self.taskList.tasksById[data.taskId].links[id]
	      })

	      /*----------  setDataLinks  ----------*/
	      socket.on('setDataLinks',function(data)
	      {
	        var l = new link(data)
	        var divLinks = $(".task[tid=" + l.taskId + "] .links")
	        if(divLinks){
	          divLinks.append(l.display())        
	          self.taskList.tasksById[l.taskId].removeLink();
	        }
	        self.taskList.tasksById[l.taskId].links[l.id] = l
	      })

	      /*----------  setDataMessages  ----------*/
	      socket.on('setDataMessages',function(data)
	      {
	        var m = new message(data)
	        var t = self.taskList.tasksById[m.taskId]
	        var divMessage = $(".task[tid=" + m.taskId + "] .chat")
	        if(divMessage){
	          t.chat.messages.push(m)
	          t.chat.$messages.append(m.display())
	          t.chat.checkForChanges()
	          t.chat.displayLastMessage()
	        }
	        t.messages[m.id] = m
	      })

	      socket.on('checkUrlExists', function (result)
	        {
	          if(result.urlExists){
	            var t = self.taskList.tasksById[result.taskId];
	            $("#upload").html(t.getAttachBtn());
	            t.attachBtnOnClcik();
	            $(".link-form").remove();
	          }else{
	            $("#link-url").addClass("error");
	            $(".link-form").effect("shake",{direction :"up"});
	          }
	          
	        });

	/*----------  updateAvatar  ----------*/
	      socket.on('updateAvatar',function(data)
	      {
	          var url = 'img/user/'+ data.userId +'.jpg?' + moment().unix()
	          $(".avatar" + data.userId).attr("src", url )
	          if(self.connectUserId == data.userId){
	            $(".bgAvatar").css("background","url(" + url + ")")
	          }
	        })

	/*----------  changeRelease  ----------*/
	      socket.on('changeRelease',function(data)
	      {
	        var t = new task(data);
	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if(selectedTask){

	          var oldTypeID = self.taskList.tasksById[t.id].typeId
	          var oldColor = self.taskList.taskTypes[oldTypeID].color;
	          var newColor = self.taskList.taskTypes[t.typeId].color;
	          var newEnv = self.getLastRelease(t.typeId)
	          selectedTask.removeClass( oldColor )
	          selectedTask.addClass( newColor )
	          selectedTask.find( ".env" ).html(newEnv)
	        }
	        self.taskList.tasksById[t.id].typeId = t.typeId
	      })

	/*----------  addRelease  ----------*/
	      socket.on('addRelease',function(r)
	      {

	          // Ajout de la release dans le tableau de release indexé par id
	          self.releasesById[r.id] = r
	          // Ajout de la release dans le tableau de release indexé par jour
	          if(self.releases[r.day] == undefined){
	            self.releases[r.day] = new Array();
	          }
	          self.releases[r.day].push(r);

	          // Ajout dans le DOM
	          var cible = $(".releaseSlot[di="+ self.datesIndex[r.day] +"]")
	          if(cible){
	            var htmlRelease = self.renderRelease(r);
	            cible.append(htmlRelease)
	          }
	      })

	      socket.on('addRelease',function(taskType)
	      {
	          self.taskList.taskTypes[taskType.id] = taskType
	      })





	    }

	/**
	 *
	 * JQUERY INITIALISATION
	 *
	 */
	    activate(){
	      // Task drag and drop
	      var self = this
	      $( "body" ).off().mousedown(function(e) {
	          //log("click out")
	          if(!self.select){
	            $.each(self.selectedTasks, function( key, t ) {
	              t.removeClass('selected');
	              delete self.selectedTasks[t.attr("tid")];
	            });
	            self.disabledTaskBtn(true)
	          }
	          self.select = false;
	      })

	      $( ".connectedSortable" ).sortable({
	        revert:150,
	        cancel: ".disable-task",
	        placeholder: "ui-sortable-placeholder",
	        connectWith: ".connectedSortable",
	        start( event, ui ) {
	          //log("start")
	          var t = self.taskList.tasksById[ui.item.attr("tid")];
	          if(t.isLocked){
	            $( this ).sortable( "cancel" );
	          }else{
	            t.isDraging = true;
	          }
	        },
	        stop( event, ui ) {
	          //log("stop")
	          var t = self.taskList.tasksById[ui.item.attr("tid")];
	          t.isDraging = false;
	        },
	        update:function( event, ui ) {
	          //log("CLIENT MOVE TASK")
	          var tasksToUpdate = $(this).sortable('toArray', {attribute: 'tid'})
	          var tasksUpdate = []
	          tasksToUpdate.map(function(id,pos){
	            var t = self.taskList.tasksById[id];
	            t.priority = pos
	            tasksUpdate.push(t)
	          })
	          //log(tasksUpdate)
	          socket.emit('moveTask', tasksUpdate);
	        },
	        receive( event, ui ) {
	          //log("recive");
	          var t = self.taskList.tasksById[ui.item.attr("tid")];
	          t.day = self.dates[$(this).attr("di")];
	          t.userId = $(this).attr("uid");
	          //t.creationUserId = self.connectUserId;
	          socket.emit('setData', t);
	        }
	      }).disableSelection();

	/*----------  Task click ----------*/
	      $( ".connectedSortable > li" ).mousedown(function(e,obj) {
	        //log("down");
	        //e.stopPropagation();
	        self.select = true;
	        self.disabledTaskBtn(false)
	        var id = $(this).attr("tid");
	        var t =  self.taskList.tasksById[id];
	        if(! t.isOpen && !t.isLocked){
	          if(!e.ctrlKey){
	            $.each(self.selectedTasks, function( key, t ) {
	              t.removeClass('selected');
	              delete self.selectedTasks[t.attr("tid")];
	            });
	          }
	          //log("selected");
	          var selectedTask = $(this);
	          selectedTask.addClass('selected');
	          self.selectedTasks[selectedTask.attr("tid")] = selectedTask;
	        }
	      });

	/*----------  Task double click ----------*/
	      $( ".connectedSortable > li" ).dblclick(function() {
	        //log("dbleclick");
	        var id = $(this).attr("tid");
	        var t =  self.taskList.tasksById[id];
	        if(!t.isDraging){
	        $(this).removeClass('selected');
	        if(! t.isOpen && !t.isLocked){
	          t.open($(this));
	        }
	      }
	      });

	/*----------  Task tooltip  ----------*/
	      $( ".task" ).tooltip({
	        items: "li",
	        content(){
	          var element = $( this );
	          var idTask = element.attr("tid");
	          var t = self.taskList.tasksById[idTask];
	          var color = self.taskList.taskTypes[t.typeId].color;
	          if(color == "pink"){
	            return "";
	          }
	          return '<div class= "tooltip ' + color + '"><h1>' + element.text() + '</h1>' + t.desc + '</div>';
	        },
	         position: {
	            my: "left top",
	            at: "right top"
	        }
	      });

	/*----------  Release drag and drop  ----------*/
	      $( ".releaseSlot" ).sortable({
	        revert:150,
	        connectWith: ".releaseSlot",
	        receive( event, ui ) {
	          var r = self.releasesById[ui.item.attr("tid")];
	          r.day = self.dates[$(this).attr("di")];
	          socket.emit('setRelease', r);
	        }
	      }).disableSelection();


	/*----------  Release drag and drop  ----------*/

	    $("#accountable").on('mousedown', 'li a', function(){
	      var idUser = $(this).data('value')
	      self.assignAccountable(idUser)
	    });

	    $("#accountable").on('click', 'li a', function(){
	      $( this ).blur()
	    });
	    }







	/**
	 *
	 * CHANGE WEEK
	 *
	 */
	    changeInterval(nbWeek){
	      //log(this.now.format('MMMM Do YYYY'));
	      this.now = this.now.add(nbWeek,'w');
	      this.init();
	      this.sync();
	      this.render();
	      this.activate();
	    }
	/**
	 *
	 * LOGOUT
	 *
	 */
	    logout(){
	      socket.emit('logout', connectUser);
	    }

	    disabledTaskBtn($disabled){
	      $( "#dropdownAccountable" ).prop( "disabled", $disabled )
	      $( "#valid_btn"           ).prop( "disabled", $disabled )
	      $( "#duplicate_btn"       ).prop( "disabled", $disabled )
	      $( "#archive_btn"         ).prop( "disabled", $disabled )
	      $( "#del_btn"             ).prop( "disabled", $disabled )
	    }



	/**
	 *
	 * Projects
	 *
	 */
	    getProjects(){
	      var html = 
	      '<button id="btnProject" type="button" class="btn btn-primary" ntitle="Mes projets">' + 
	      '<span class="glyphicon glyphicon-th" aria-hidden="true"></span></button>'
	      return html;
	    }

	    btnProjectHandler(){
	        var self = this;
	        $("#btnProject").click(function(){
	          if(!self.projectIsOpen){
	            var ps = new projectScreen(self.projectByUser[self.connectUser.id],self.projectById,self.usersById);
	            ps.dispayMyProject();
	            $(".strip").hide();
	            self.projectIsOpen = true;
	          }else{
	            self.closeProject()
	          }
	        });
	    }

	    closeProject(){
	      $(".strip").show();
	      $("#screenContainer").html('<div id="tasksManager" style="margin-top: 0px; opacity: 1;"></div><div id="box"></div>');
	      this.projectIsOpen = false;
	      this.sync()
	      this.render()
	      this.activate();
	    }
	    selectProject(id){
	      if(id != this.selectedProject){
	        if(id == undefined || id == 0 ) {
	          id = this.projectByUser[this.connectUser.id][0]
	        }
	        this.selectedProject = id
	        if(this.projectById[id]){
	          this.projectById[id].selected = true
	        }
	        socket.emit('selectProject',id);
	      }
	    }
	    unSelectProject(id){
	      this.projectById[id].selected = false
	    }

	    toogleProject(projectId){
	      p = this.projectsId[projectId]
	      if(this.projectsId[projectId]){
	        delete this.projectsId[projectId]
	      }else{
	        this.projectsId[projectId] = true
	      }
	      this.init();
	      this.sync();
	      this.render();
	      this.activate();
	    }

	    getTypeList(){
	      console.log(this.selectedProject)
	      var self = this;
	      var html = '';
	      self.taskList.taskTypeByProject[self.selectedProject].map(function(t,key) {
	        html = '<option value="' + t.id + '">' + t.name + '</option>' + html;
	      });
	      return html;  
	    }

	    getProjectTitle(id){
	      return this.projectById[id].title;
	    }


	    getUsersList()
	    {
	        var html = ""
	        var count = 0;
	        $.each( this.users, function( key, user ) {
	          if(user && user.display){
	            var ico = "glyphicon-remove-sign"
	            if(user.logged==1){
	                count ++;
	                ico = "glyphicon-ok-sign"
	            }
	            if(html!=""){
	               html += '<li role="separator" class="divider"></li>' 
	            }
	            html += '<li><a href="#">' + user.getAvatar(32) + '<span class="glyphicon ' + ico + '" aria-hidden="true"></span>' + user.firstName + '</a></li>'
	        }
	      })
	        return {"list":html,"nb":count}
	    }

	    isUserDisplay(userId)
	    {
	      return this.users[userId].display
	    }

	    getUserProjects()
	    {
	      //Todo
	      return '';
	    }

	    getPublicProject()
	    {
	      //Todo
	      return '';
	    }
	  }
	module.exports = tasksManager

/***/ },
/* 4 */
/***/ function(module, exports) {

	class user{
	  constructor(data){
	    this.id = data.id;
	    this.firstName = data.firstName;
	    this.lastName = data.lastName;
	    this.level = data.id_group;
	    this.display = false
	    this.logged = data.logged
	  }
	  getName(){
	    return this.firstName + " " + this.lastName;
	  }

	  getAvatar(size){
	      return '<img class="img-circle avatar avatar' + this.id + '" src="img/user/' + this.id + '.jpg" width="' + size + '" height="' + size + '" />';
	  }
	  getStatus(){
	    var ico = "glyphicon-remove-sign"
	    if(this.logged == 1){
	      ico = "glyphicon-ok-sign"
	    }
	    return '<span class="glyphicon ' + ico + '" aria-hidden="true"></span>';
	  }
	}
	module.exports = user;

/***/ },
/* 5 */
/***/ function(module, exports) {

	class file{
	  constructor(data){
	    this.id = data.id;
	    this.taskId = data.taskId;
	    this.name = data.title;
	    this.type = data.type;
	    this.fullUrl = "";
	  }

	  buildUrl() {
	    var baseUrl = this.fullUrl + "files/";
	    this.url = baseUrl + this.name;
	    this.thumbnailUrl = baseUrl + "thumbnail/" + this.name;
	    return true
	  }

	  display(){
	    this.buildUrl();
	    var html;
	    if (this.url) {
	      html = '<div class="file"><a class="content" target="_blank" href="' + this.url + '" >' + this.getThumbnail() + '</a>' + this.name + ' <a href="#" fid="' + this.id + '" class="removeFile" >X</a></div>';
	    } else if (this.error) {
	      html  = '<span class="text-danger">' + this.error + '<br>' + error + '</span>'
	    }
	    return html;
	  }

	  getThumbnail(){
	    var html = ""
	    switch(this.type){
	      case "image/jpeg" :
	        html = '<img src="' + this.thumbnailUrl + '" />';
	        break
	      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
	        html = '<img src="' + this.fullUrl + "/img/ico/doc.png" + '" />';
	        break
	      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
	        html = '<img src="' + this.fullUrl + "/img/ico/ppt.png" + '" />';
	        break
	      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
	        html = '<img src="' + this.fullUrl + "/img/ico/xls.png" + '" />';
	        break
	        
	      default : 
	        html = this.type
	    }
	    return html
	  }
	}
	module.exports = file;

/***/ },
/* 6 */
/***/ function(module, exports) {

	class link{
	  constructor(data){
	    this.id = data.id;
	    this.taskId = data.taskId;
	    this.title = data.title;
	    this.url = data.link;
	  }

	  display(){
	    var html = '<div class="link">'
	    html += '<a href="' + this.url + '" target="_blank" class="btn btn-link"><span><i class="glyphicon glyphicon-link"></i></span><br></a>';
	    html += this.title;
	    html += ' | <a href="#" lid="' + this.id + '" class="removeLink" title="Remove link">X</a>D';
	    html += '</div>';
	    return html 
	  }

	  getThumbnail(){
	    var html = ""
	    switch(this.type){
	      case "image/jpeg" :
	        html = '<img src="' + this.thumbnailUrl + '" />';
	        break
	      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
	        html = '<img src="' + this.fullUrl + "/img/ico/doc.png" + '" />';
	        break
	      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
	        html = '<img src="' + this.fullUrl + "/img/ico/ppt.png" + '" />';
	        break
	      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
	        html = '<img src="' + this.fullUrl + "/img/ico/xls.png" + '" />';
	        break
	        
	      default : 
	        html = this.type
	    }
	    return html
	  }
	}
	module.exports = link;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var socket = window.socket
	var chat = __webpack_require__(8);
	class task{
	  constructor(data){
	    this.isOpen = false;
	    this.isDraging = false;
	    this.id = data.id;
	    this.typeId = data.typeId;
	    this.userId = data.userId;
	    if(data.day != "0000-00-00"){
	      this.day = moment(data.day).format('YYYY-MM-DD');
	    }else{
	      this.day = data.day
	    }
	    this.creationDate = data.creationDate;
	    this.creationUserId = data.creationUserId;
	    this.accountableUserId = data.accountableUserId;
	    this.updateDate = data.updateDate;
	    this.title = data.title;
	    this.description = data.description;
	    this.files = [];
	    this.links = [];
	    this.messages = [];
	    this.priority = data.priority
	    this.w = 0
	    this.h = 0
	    this.valid = data.valid
	    this.initPosition
	    this.id_project = data.id_project
	    this.chat = null
	    this.isLocked = (window.tm.selectedProject != this.id_project);
	    var self = this;
	  }

	  getTitle(){
	    if (this.title == ""){
	      return "Sans titre"
	    }else{
	      return this.title
	    }
	  }

	  getDescription(){
	    if (this.description == ""){
	      return "Sans descriptif"
	    }else{
	      return this.description
	    }
	  }

	  open(htmlTask){
	    var self = this
	    var htmlTitle = htmlTask.children(".contener").children("span")
	    htmlTask.find("#taskDetail").remove();
	    var description = this.description;
	    var taskId = this.id;

	    htmlTask.parent().enableSelection(); 

	    if (description == ""){description = "Sans descriptif";}
	    if (this.title == ""){htmlTask.htmlTitle.html("Sans titre");}
	    
	    var p = htmlTask.position();

	    htmlTask.css("position","absolute");
	    this.initPosition = p;
	    this.w = htmlTask.width();
	    this.h = htmlTask.height();
	    htmlTask.css({
	      "z-index":1000,
	      "left":p.left,
	      "top":p.top,
	      "cursor":"default"
	    });
	    htmlTask.animate({
	      left:0,
	      top:$("body").scrollTop(),
	      width:  "100%",
	      height:  "100%",
	    }, 400, function() {
	      htmlTask.css({"text-align":"left"});
	      htmlTitle.css({"display":"block"});
	      $("body").css("overflow","hidden");
	      var html =  '<div id="taskDetail"><div class="chat"></div>';
	      html +='<div id="closeTask"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>';

	      html +='<div class="attach-conainer"><div id="upload">' + self.getAttachBtn() + '</div>';

	      html += self.displayFiles();
	      moment.locale('fr');
	      html += '</div><p><button id="shifting_prev" type="button" class="btn btn-default" title="Avancer à la release précédente">' +
	      '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>';
	      html += ' <button id="shifting_next" type="button" class="btn btn-default" title="Repousser à la prochaine release">' +
	      '<span  class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></p>';
	      html += '<p>ID : ' + self.id + '</p>';
	      html += '<p>Responsable : ' + self.getCreationUser() + ", créé "+ moment(self.creationDate).fromNow() + '</p>';
	      html += '<p>Attribué à ' + self.getEditUser() + '</p>';
	      html += self.displayLinks();
	      html += '<p class="desc">' + description + '</p>';
	      html += '</div>';

	      htmlTask.find("#taskDetail").remove();
	      htmlTask.children(".contener").append(html);

	      self.removeFile()
	      self.removeLink()
	      self.attachBtnOnClcik();

	      self.chat = new chat(".chat",self.messages,self.id)

	  self.siofu = new SocketIOFileUpload(socket);

	  $("#shifting_prev").click(function(){
	    var prev = window.tm.getNextRelease(self.typeId,true)
	    if(prev){
	      socket.emit('changeRelease', {"t":self,"typeId":prev});
	    }
	  });

	  $("#shifting_next").click(function(){
	    var next = window.tm.getNextRelease(self.typeId,false)
	    if(next){
	      socket.emit('changeRelease', {"t":self,"typeId":next});
	    }
	  });
	  //siofu.listenOnInput($("#upload_btn"));
	  //siofu.listenOnDrop($("#file"));

	  self.siofu.addEventListener("start", function(event){
	      $('#progress .progress-bar').css('width',0);
	  });

	  // Do something on upload progress:
	  self.siofu.addEventListener("progress", function(event){
	      var percent = event.bytesLoaded / event.file.size * 100;
	      console.log("File is", percent.toFixed(2), "percent loaded");
	      $('#progress .progress-bar').css('width',percent + '%');
	  });

	  // Do something when a file is uploaded:
	  self.siofu.addEventListener("complete", function(event){

	      if(event.success){
	      socket.emit('setDataFiles', {title:event.file.name,type:event.file.type,taskId:taskId});
	      $('#progress .progress-bar').delay(800).queue(function (next) {
	          $(this).css('width',0);
	            next();
	          });
	      }
	  });
	  
	      $("#closeTask").click(function() {
	        self.close(htmlTask);
	        $("body").css("overflow","auto");
	      });

	       // Edition du descriptif
	      htmlTask.find(".desc").unbind('dblclick').dblclick(function() {
	        if(!this.editMode){
	            var parent = this;
	            var content = $(this).html().replace(/<br>/g,'\n');
	            if (content == "Sans descriptif"){content = "";}
	            $(this).html("<textarea >" + content + "</textarea >");
	            $(this).children("textarea").focus();
	            $(this).children("textarea").select();
	            this.editMode = true;
	            $(this).children("textarea").blur(function() {
	              content = $(this).val().replace(/\n\r?/g, '<br>');
	              parent.editMode = false;
	              self.description = content;
	              self.save();
	              if (content == ""){content = "Sans descriptif";}
	              $(parent).html(content);
	            });
	        }
	      });

	    });
	    htmlTitle.css({
	      "vertical-align": "initial",
	      "text-align": "left",
	       "margin-left":"20px"
	    });
	    htmlTitle.animate({
	      "font-size": "60px"
	    });

	      // Edition du titre
	    htmlTitle.dblclick(function() {
	      if(!this.editMode){
	        var parent = this;
	        var content = $(this).html();
	        if (content == "Sans titre"){content = "";}
	        $(this).html("<input type='text' value='" + content + "' />");
	        $(this).children("input").focus();
	        $(this).children("input").select();
	        this.editMode = true;
	        $(this).children("input").blur(function() {
	          content = $(this).val();
	          parent.editMode = false;
	          self.title = content;
	          self.save();
	          if (content == ""){content = "Sans titre";}
	          $(parent).html(content);
	        });
	      }
	    });
	    this.isOpen = true;
	    htmlTask.addClass('disable-task');
	  }

	  getProgressBar(){
	    return '<div id="progress" class="progress"><div class="progress-bar progress-bar-success"></div></div>';
	  }

	  getAttachBtn(){
	    return '<button id="attach_btn" class="btn btn-attach"><span ><i class="glyphicon glyphicon-plus"></i></span></button>' + this.getProgressBar();
	  }

	  attachBtnOnClcik(){
	    var self = this;
	    $("#attach_btn").click(function() {
	      var html = '<button id="link_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-link"></i> Add link</span></button>'
	      html += '<button id="upload_btn" class="btn btn-attach-mini fileinput-button"><span ><i class="glyphicon glyphicon-upload"></i> Add File</span></button>'
	      html += self.getProgressBar();
	      $("#upload").html(html);
	      $("#upload_btn").click(self.siofu.prompt)
	      $("#link_btn").click(function() {
	        html = '<div class="link-form"><div class="input-group"><span class="input-group-addon" id="basic-addon">Title</span>';
	        html += '<input type="text" class="form-control" id="link-title" aria-describedby="basic-addon"></div>';
	        html += '<div class="input-group"><span class="input-group-addon" id="basic-addon2">Link</span>';
	        html += '<input type="text" class="form-control" id="link-url" aria-describedby="basic-addon2"></div></div>';
	        $("#files").prepend(html);

	        html = '<button id="remove_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-remove"></i></span></button>';
	        html += '<button id="ok_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-ok"></i></span></button>';
	        html += self.getProgressBar();
	        $("#upload").html(html);

	        $("#link-title").focus();

	        $("#remove_btn").click(function() {
	          $(".link-form").remove();
	          $("#upload").html(self.getAttachBtn());
	          self.attachBtnOnClcik();
	        }); 

	        $("#ok_btn").click(function() {
	          var title = $("#link-title").val()
	          var link = $("#link-url").val()
	          $(".form-control").removeClass("error");
	          if(title == ""){
	            $("#link-title").addClass("error");
	          }
	          if(link == ""){
	            $("#link-url").addClass("error");
	          }

	          if(title!="" && link != ""){

	            var data = {title:title,url:link,taskId:self.id}
	            socket.emit('setDataLinks', data);
	          }else{
	            $(".link-form").effect("shake",{direction :"up"});
	          }
	        });
	      });
	    });
	  }
	  removeFile()
	  {
	      var self = this
	      $('.removeFile').off()
	      $('.removeFile').click(function(){
	        var fid = $(this).attr('fid');
	        socket.emit('delDataFiles', self.files[fid]);
	      });
	  }

	  removeLink()
	  {
	      var self = this
	      $('.removeLink').off()  
	      $('.removeLink').click(function(){
	        var lid = $(this).attr('lid');
	        socket.emit('delDataLinks', self.links[lid]);
	      });
	  }
	    /////////////////////
	    // masquage du details de la tache

	    close(htmlTask){
	      $("#upload_btn").off()
	      $("#shifting_prev").off()
	      $("#shifting_next").off()
	      
	        
	      this.siofu.removeEventListener("start")
	      this.siofu.removeEventListener("progress")
	      this.siofu.removeEventListener("complete")
	      this.siofu.destroy();
	      this.siofu = null;

	      var htmlTitle = htmlTask.children(".contener").children("span")
	      var p = this.initPosition;
	      var w = this.w;
	      var h = this.h;
	      htmlTask.children(".contener").children("#taskDetail").remove();
	      htmlTitle.unbind('dblclick');
	      htmlTask.animate({
	        left:p.left,
	        top:p.top,
	        width:  w,
	        height:  h
	      }, 400, function() {
	        htmlTask.css({
	          "left":"inherit",
	          "top":"inherit",
	          "position":"relative",
	          "z-index":"auto"
	        });
	        htmlTitle.css({"display":"table-cell"});
	      });
	      htmlTitle.css({
	        "vertical-align": "middle",
	        "text-align": "center"
	      });
	      htmlTitle.animate({
	        "font-size": "14px"
	      });
	      this.isOpen = false;
	      htmlTask.removeClass('disable-task');
	    }

	    /////////////////////
	    // affichage du nom de l'utilisateur

	    getCreationUser(){
	      var user = window.tm.getUser(this.creationUserId);
	      if (user != undefined){
	        return user.getName();
	      }
	    }

	    /////////////////////
	    // affichage du nom de l'utilisateur

	    getEditUser(){
	      var user = window.tm.getUser(this.accountableUserId);
	      if (user != undefined){
	        return user.getName();
	      }
	    }

	    /////////////////////
	    // Sauvegarde d'une tache

	    save(){
	      if(this.day != "0000-00-00"){
	        this.accountableUserId = this.userId
	      }
	      socket.emit('setData', this);
	    }
	    update(data){
	        this.typeId = data.typeId;
	        this.userId = data.userId;
	        if(data.day != "0000-00-00"){
	          this.day = moment(data.day).format('YYYY-MM-DD');
	        }else{
	          this.day = data.day
	        }
	        this.creationDate = data.creationDate;
	        this.creationUserId = data.creationUserId;
	        this.accountableUserId = data.accountableUserId;
	        this.updateDate = data.updateDate;
	        this.title = data.title;
	        this.description = data.description;
	        this.priority = data.priority
	        this.valid = data.valid
	    }

	    displayFiles(){
	      var html = '<div id="files" class="files">';
	      $.each( this.files, function( key, file ) {
	        if(file){
	          html += file.display();
	        }
	      });
	      return html + '</div>';
	    }

	    displayLinks(){
	      var html = '<div class="links">';
	      $.each( this.links, function( key, link ) {
	        if(link){
	          html += link.display();
	        }
	      });
	      return html + '</div>';
	    }

	    getNextPriority(tasks,priority){
	      var k = this.userId + ":" + this.day;
	      if(tasks[k][priority] != undefined ){
	        return this.getNextPriority(tasks,priority+1);
	      }else{
	        return priority;
	      }
	    }
	}
	module.exports = task;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var message = __webpack_require__(9);
	class chat{
	  constructor(container,messages,taskId){
	    this.$container = $(container)
	    this.display();
	    this.messages = messages;
	    this.$messages = $('.messages');
	    this.$input = $('.chatInput');
	    this.$btnSend = $('#btnSend');
	    this.lastHeight = this.$input.height();
	    this.totalHeight = this.$container.height();
	    this.userId = window.tm.connectUserId;
	    this.taskId = taskId;
	    this.init();
	  }

	  display(){
	     this.$container.html('<div class="messages"></div>\
	        <div class="addMessage">\
	          <div class="chatInput" contenteditable="true" placeholder="Entrer un message ici"></div>\
	          <button id="btnSend" class="btn btn-default" type="button"><span class="glyphicon \glyphicon-send" aria-hidden="true"></span></button>\
	        </div>');
	  }

	  sendMessage()
	  {
	    var txt = this.$input.html().replace(/<div>/g, "").replace(/<\/div>/g, "<br>");
	    if(txt!=""){
	      var data = {
	        "userId" : this.userId,
	        "moment" : moment(),
	        "txt" : txt,
	        "taskId" : this.taskId
	      }
	      socket.emit('setDataMessages', data);
	      this.$input.text("")
	    }
	  }

	  checkForChanges()
	  {
	    if (this.$input.height() != this.lastHeight)
	    {
	        this.lastHeight = this.$input.height(); 
	        var oldMessagesHeight = this.$messages.height()
	        var newMessagesHeight = this.totalHeight-this.lastHeight
	        this.$container.css("padding-bottom" , (this.lastHeight + 15) + "px")
	        this.$messages.scrollTop(this.$messages.scrollTop()- newMessagesHeight +10 + oldMessagesHeight)
	    }
	  }

	  displayLastMessage()
	  {
	    this.$messages.scrollTop(this.$messages.prop("scrollHeight"));
	  }

	  displayMessages()
	  {
	    var html = ""
	    this.messages.map(function(m,key){
	      html += m.display()
	    })
	    this.$messages.html(html)
	  }

	  init()
	  {
	    var self = this

	    //this.mapUsers()
	    //this.mapMessages()
	    this.displayMessages()
	    this.displayLastMessage()

	    // afficher le chat quand le scroll est fini
	    this.$container.css("visibility","visible")

	    // Saisie d'une valeur
	    this.$input.keyup(function(e){
	      self.checkForChanges()
	    });

	    this.$input.keydown(function(e){
	      self.delay(function(e){self.checkForChanges()},10)
	    });
	    
	    // Envoy dun message
	    this.$btnSend.click(function(e){
	      self.sendMessage()
	    });

	    // Gestion de la touche entrer
	    this.$input.keypress(function(e){
	      if(e.which == 13 && !event.shiftKey ) {
	          self.sendMessage();
	          e.preventDefault();
	      }
	    });
	  }
	  delay(callback, ms){
	    var timer = 0;
	    clearTimeout (timer);
	    timer = setTimeout(callback, ms);
	  };
	}
	module.exports = chat;

/***/ },
/* 9 */
/***/ function(module, exports) {

	class message{
	  constructor(data){
	    this.id = data.id
	    this.userId = data.userId
	    this.taskId = data.taskId
	    this.txt = data.txt
	    this.moment = moment(data.moment,"YYYY-MM-DD HH:mm:ss")
	    this.user = window.tm.users[data.userId]
	    this.me = data.userId == window.tm.connectUserId
	  }

	  display(){
	    var html = ''
	    if(this.me){
	      html += '<div class="me">'
	    }else{
	      html += '<div class="other">'
	      html += this.user.getAvatar(32)
	    }
	    html += '  <div class="messageTime">' + this.getTime() + '</div>'
	    html += '  <div class="message">'
	    if(!this.me){
	      html += '   <div class="userName">' + this.user.getName() + '</div>'
	    }
	    html += '   <div><p>' + this.txt + '</p></div>'
	    html += '  </div>'
	    html += '</div>'
	    return html
	  }

	  getTime(){
	    return this.moment.format("HH:mm")
	  }
	}
	module.exports = message;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var project = __webpack_require__(11);
	var acUser = __webpack_require__(12);
	//////////////////////////////////////////
	//
	//  PROJECT SCREEN CLASS
	//
	//////////////////////////////////////////
	class projectScreen{
	    constructor(projectsUser,projects,usersById){
	        this.nbCol = 3;
	        this.AllProject = projects
	        this.projectsData = [];
	        this.usersById = usersById
	        this.mapData(projectsUser);
	    }

	    dispayMyProject()
	    {
	        var html = '<div class="container"><div class="starter-template"><h1>Projets';
	        html += ' <a id="addUser" href="#" class="btn btn-success" title="Ajouter un projet"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>';
	        html += '</h1></div>';
	        var nbCol = 0;
	        var row = "";
	        this.projectsData.forEach(function(p,i) {
	            nbCol ++;
	            row += '<div class="col-md-4">' + p.display() + '</div>';
	            if(nbCol % this.nbCol == 0){
	                html += '<div class="row">' + row + '</div>';
	                row = "";
	            }
	        },this);
	        if(row != ""){
	            html += '<div class="row">' + row + '</div>';
	        }
	        $("#screenContainer").html('<div class="container">' + html + '</div>');
	        var self = this;
	        $(".project").click(function(){
	            var id = $(this).parents(".card").attr("projectId");
	            self.selectFav(id);
	        });
	        $(".btnFav").click(function(){
	            var id = $(this).parents(".card").attr("projectId");
	            self.displayDetails(id);
	        });
	    }

	    selectFav(id)
	    {
	        this.projectsData.forEach(function(p) {
	            if(p.id!=id){
	                window.tm.unSelectProject(p.id)
	            }
	        });
	        window.tm.selectProject(id)
	        window.tm.closeProject()
	    }

	    displayDetails(id)
	    {
	        var self = this
	        var p = this.projectsData[id];
	        $("#screenContainer").html(p.displayDetails());
	        $("#addUser").click(function(){
	            console.log("click btn add")
	            $("#addUser").hide()
	            $("#addUser").after('<input type="text" class="form-control" id="acUser" placeholder="User">')
	            $("#acUser").focus()
	            var myAcUser = new acUser("#acUser",self.usersById);
	            myAcUser.init()
	        });

	    }

	    mapData(projectsUser){
	        var self = this;
	        

	        projectsUser.forEach(function(projectId) {
	            var p = new project(self.AllProject[projectId]);
	            this.projectsData[p.id] = p;
	        },this);
	    }
	}
	module.exports = projectScreen;

/***/ },
/* 11 */
/***/ function(module, exports) {

	
	//////////////////////////////////////////
	//
	//  PROJECT OBJECT
	//
	//////////////////////////////////////////
	class project{
	  constructor(data){
	    this.id = data.id;
	    this.name = data.name;
	    this.desc = data.desc;
	    this.img = data.img;
	    this.color = data.color
	    this.isPublic = data.isPublic;
	    this.id_project = data.id_project;
	    this.selected = data.selected;
	  }

	display()
	  {
	    var html = '<div class="card" projectId="' + this.id + '">';
	    html += '<div class="btnFav"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-star';
	    if(this.selected){
	      html += ' selected';
	    }
	    html += '" aria-hidden="true"></span></button></div>'; 
	    html += '<a href="#" class="project" style="' + this.displayBackground() + '">';
	    html += this.displayName();
	    html += '</a>';
	    html += '</div>'; 
	    return html;
	  }

	  displayDetails()
	  {
	    var html = '<div class="container-fluid">';
	    html += ' <div class="row projectDetailsHeader" style="' + this.displayBackgroundColor() + '">';
	    html += '   <div class="col-md-4 col-md-offset-4">';
	    html += '     <div class="project" style="' + this.displayBackground() + '">' + this.displayName() + '</div>';
	    html += '   </div>';
	    html += ' </div>';
	    html += ' </div>';
	    html += '<div class="container">';
	    html += ' <div class="row">';
	    html += '   <div class="col-md-6">' + this.displayUsers()
	    html += '     <h2>Liens</h2>' + this.displayDocuments()  
	    html += '   <div class="col-md-6"><br><img class="img-responsive" src="img/project/visual-pitch.png" /><h2>Description</h2>' + this.desc + '</div>';
	    html += ' </div>';
	    html += '</div>';
	    return html;
	  }

	  displayUsers()
	  {
	    var html = '<h2><form class="form-inline">Collaborateurs ';
	    html += '<a id="addUser" href="#" class="btn btn-success" title="Ajouter un collaborateur"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>'
	    html += '</from></h2>';
	    html += '<div class="users row">';
	    html += '<div class="user"><div class="avatar"></div><div class="name">User 1</div></div>';
	    html += '<div class="user"><div class="avatar"></div><div class="name">User 2</div></div>';
	    html += '<div class="user"><div class="avatar"></div><div class="name">User 3</div></div>';
	    html += '<div class="user"><div class="avatar"></div><div class="name">User 4</div></div>';
	    html += '<div class="user"><div class="avatar"></div><div class="name">User 5</div></div>';
	    html += '</div>';
	    return html;
	  }

	  displayBackground()
	  {
	    var html = '';
	    if(this.img != ''){
	      html += 'background-image: url(img/project/' + this.img + ');';
	    }
	    html += this.displayBackgroundColor();
	    return html;
	  }

	  displayBackgroundColor()
	  {
	    var html = '';
	    if(this.color != ''){
	      html += 'background-color: ' + this.color + ';';
	    }
	    return html;
	  }

	  displayName(){
	    var html = '';
	    if(this.img == ''){
	      html = this.name;
	    }
	    return html;
	  }

	  displayDocuments(){
	    var html = '<div class="row"></div><div class="list-group col-sm-6">';
	    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> Site web</button>';
	    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span> Présentation</button>';
	    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-film" aria-hidden="true"></span> Vidéo</button>';
	    html += '</div>';
	    html += '<div class="list-group col-sm-6">';
	    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon glyphicon-euro" aria-hidden="true"></span> Tarification </button>';
	    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Documentation</button>';
	    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Formation</button>';
	    html += '</div></div>';
	    return html;
	  }

	  select(){
	    if(!this.selected){
	      this.selected = 1;
	      $(".card[projectid=" + this.id + "] .glyphicon-star").addClass("selected"); 
	    }
	  }

	  unSelect(){
	    if(this.selected){
	      this.selected = 0;
	      $(".card[projectid=" + this.id + "] .glyphicon-star").removeClass("selected"); 
	    }
	  }
	}
	module.exports = project;

/***/ },
/* 12 */
/***/ function(module, exports) {

	

	class acUser{
	    constructor(field,data){
	      this.field = $(field)
	      this.usersById = data;
	      this.selectedItem = -1;
	      this.searchArray = []
	      this.search = ""
	      this.result = [];
	    }

	    init(){
	    var self = this
	    this.field.after("<div class='ac'></div>")
	    this.field.keyup(function( e ) {
	      if ( e.which == 38 ) {
	        e.preventDefault()
	        self.prev()
	        
	      }else if(e.which == 40){
	        e.preventDefault()
	        self.next()
	      }else{
	        self.searchUser()
	      }
	    });
	    this.field.blur(function() {
	      $(this).val("")
	      $(this).next(".ac").html("")
	      $("#addUser").show()
	      $("#acUser").remove()
	    });
	  }

	    searchUser(){
	    console.log("///")
	    var self = this
	    this.search = this.field.val();
	    if(this.search!=""){
	    // Find matching user id
	      this.usersById.forEach(function(user) {
	        self.searchArray = self.search.split(' ');
	        var wordsFind = 0
	        var words = 0
	        self.searchArray.forEach(function(strSearch){
	          var nbMach = 0;
	          if(strSearch!=""){
	            words ++
	            nbMach += self.searchWeight(user,user.nom,1,true,strSearch)
	            nbMach += self.searchWeight(user,user.nom,1,false,strSearch)
	            nbMach += self.searchWeight(user,user.prenom,1,true,strSearch)
	            nbMach += self.searchWeight(user,user.prenom,1,false,strSearch)
	            nbMach += self.searchWeight(user,user.ville,1,true,strSearch)
	            nbMach += self.searchWeight(user,user.ville,1,false,strSearch)
	            if(nbMach>0){
	              wordsFind++
	            } 
	          }
	         })
	         if(wordsFind != words){
	            delete self.result[user.id]
	         }
	      });
	      var html = ""
	      this.result.forEach(function(user) {
	        html += "<li class='row' idUser='" + user.id 
	        html += "' ><div class='user'></div><div class='userName'>" 
	        html += self.boldStrFind(user.prenom).toLowerCase() + " " 
	        html += self.boldStrFind(user.nom).toUpperCase() + "</div><div class='city'>"
	        html += self.boldStrFind(user.ville).toLowerCase()+"</div></li>";
	      })
	      var listAc = this.field.next(".ac")
	      listAc.html("<ul>" + html + "</ul>")
	      var itemAc = listAc.find("li")
	      itemAc.mousedown(function() {
	        selfSend
	        var id = $(this).attr("idUser")
	        console.log(id + "_clcik")
	      })
	      itemAc.hover(function() {
	        self.selectItem($(this).attr("idUser"))
	      })
	      
	    }
	  }

	  boldStrFind(str){
	    var html = str
	    this.searchArray.forEach(function(strSearch){
	    if(strSearch!=""){
	      html = html.replace(new RegExp(strSearch,'gi'), "<b>" + strSearch + "</b>" );
	      }
	    })
	    return html
	  }

	  searchWeight(user,param,weight,exact,strSearch){
	    if(exact){
	      strSearch = '^' + strSearch + '$'
	    }
	    if(param.search(new RegExp(strSearch,'i')) != -1){
	      if(!this.result[user.id]){
	        user.weight = 0
	        this.result[user.id] = user
	      }
	      this.result[user.id].weight += weight
	      return 1;
	    }
	    return 0;
	  }

	  selectItem(id){
	    $(".ac ul>li.selected").removeClass("selected")
	    $(".ac ul>li[idUser=" + id + "]").addClass("selected")
	    this.selectedItem = id
	  }

	  next(){
	    var self = this
	    var firstItem = -1;
	    var item = -1;
	    this.result.forEach(function(user,i) {
	      if(firstItem == -1){
	        firstItem = i
	      }
	      if(item==-2){
	        item = i
	      }
	        if(self.selectedItem == user.id){
	        item = -2
	      }
	    })
	    if(item<0){
	        item = firstItem
	    }
	    this.selectItem(this.result[item].id)
	  }

	  prev(){
	    var self = this
	    var item = -1;
	    this.result.forEach(function(user,i) {
	        if(self.selectedItem == user.id){
	        item = prevItem
	      }
	      prevItem = i
	    })
	    if(item == -1){
	        item = prevItem
	    }
	    this.selectItem(this.result[item].id)
	  }

	  sendId()
	  {
	    console.log(this.selectedItem)
	  }
	}
	module.exports = acUser;


/***/ },
/* 13 */
/***/ function(module, exports) {

	class box{
	  constructor(data){
	    this.id = data.id;
	    this.id_project = data.id_project;
	    this.name = data.name;
	    this.order = data.order;
	  }
	  render(){ 
		  var html = ''
		  var htmlTasks = this.renderTasks(this.id + ":0000-00-00",true)
		  if(this.searchValue == "" || htmlTasks != ""){
		   
		    html = '<div class="panel panel-default box">';
		    html += '<div class="panel-heading">' + this.name + '</div>';
		    html +=   '<div class="panel-body">';
		    html +=     '<ul class="connectedSortable" di = "-1" uid ="' + this.id + '">' 
		    html +=       this.renderTasks(this.id + ":0000-00-00",true)
		    html +=     '</ul>'
		    html +=   '</div>';
		    html += '</div>';
		  }
		  return html;
		}
	}
	module.exports = box;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var Box = __webpack_require__(13);
	class BoxList
	{
	    constructor(){
	        this.boxs = []
	        this.boxsByProject = []
	    }

	    setData(data){
	    	self = this
	        data.map(function(data,key) {
		      if(data!=undefined){
		        var box = new Box(data)
		        self.boxs[box.id] = box;

		        if(self.boxsByProject[box.id_project] == undefined ){
		          self.boxsByProject[box.id_project] = [];
		        }
		        self.boxsByProject[box.id_project][box.order] = box;
		      }
		    })
	    }
	    render(selectedProject){
	    	
	    }
	}

	module.exports=BoxList;



/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var Task = __webpack_require__(7);
	var File = __webpack_require__(5);
	var Link = __webpack_require__(6);
	var Message = __webpack_require__(9);
	class TaskList
	{
	    constructor(){
	      this.tasks = [];
	      this.tasksById = [];
	      this.files = {};
	      this.links = {};
	      this.messages = {};
	      this.taskTypes = [];
	      this.taskTypeByProject = [];
	    }

	    setData(data){
	    	this.setFilesData(data.tasks_files)
	    	this.setLinksData(data.tasks_links)
	    	this.setMessagesData(data.tasks_messages)
	    	this.setTypeData(data.taskTypes)
	    	this.setTaskData(data.tasks)
	    }

	    setTaskData(data){
	    	self = this
	    	data.map(function(data,key) {
	        
		        if(data!=undefined){
		          data.id_project = self.taskTypes[data.typeId].id_project;
		          var t = new Task(data);

		          if(self.files[t.id] != undefined ){
		            t.files = self.files[t.id];
		          }

		          if(self.links[t.id] != undefined ){
		            t.links = self.links[t.id];
		          }

		          if(self.messages[t.id] != undefined ){
		            t.messages = self.messages[t.id];
		          }
		          
		          var k = t.userId + ":" + t.day;
		          if(self.tasks[k] == undefined ){
		            self.tasks[k] = new Array();
		          }
		          var nextPriority = t.getNextPriority(self.tasks,t.priority);
		          t.priority = nextPriority;
		          self.tasks[k][nextPriority] = t;
		          self.tasksById[t.id] = t;
		        }
		    });
	    }

	    setTypeData(data){
	    	self = this
		    data.map(function(taskType,key) {
		        self.taskTypes[taskType.id] = taskType;
		        var key = taskType.id_project
		        if(self.taskTypeByProject[key]==undefined){
		          self.taskTypeByProject[key] = []
		        }
		        self.taskTypeByProject[key].push(taskType);
		     });

	    }

	    setFilesData(data){
	      self = this
	      data.map(function(data,key ) {
	        if(data!=undefined){
	          if(self.files[data.taskId] == undefined ){
	            self.files[data.taskId] = [];
	          }
	          self.files[data.taskId][data.id] = new File(data);
	        }
	      });
	    }

	    setLinksData(data){
	      self = this
	      data.map(function(data,key ) {
	        if(data!=undefined){
	          if(self.links[data.taskId] == undefined ){
	            self.links[data.taskId] = [];
	          }
	          self.links[data.taskId][data.id] = new Link(data);
	        }
	      });
	    }

	    setMessagesData(data){
	      self = this
	      data.map(function(data,key ) {
	        if(data!=undefined){
	          if(self.messages[data.taskId] == undefined ){
	            self.messages[data.taskId] = [];
	          }
	          self.messages[data.taskId][data.id] = new Message(data);
	        }
	      });
	    }

	    render(key,inBox){
	      var html = ''
	      var tabTask = this.tasks[key];
	      if(tabTask){
	        for (var i = 0; i < tabTask.length; i++){
	          var t = tabTask[i];
	          if(t!=undefined){
	              html += this.renderTask(t,inBox)
	          }
	        }
	      }
	      return html;
	    }

	    renderTask(task,inBox){
	        var html = ''
	        if(window.tm.projectsId[task.id_project] && (!inBox || !task.isLocked)){
	          var color = this.taskTypes[task.typeId].color;
	          var env = '';
	          var validClass = "ok hidden"
	          var taskTitle = task.title
	          if(!task.isLocked){
	            if(task.typeId!=5 && task.typeId!=6){
	               env = '<div class="env">' + window.tm.getLastRelease(task.typeId) + '</div>'
	            }
	            if(task.valid==1){
	              validClass = "ok"
	            }
	          }else{

	            taskTitle = window.tm.projectById[task.id_project].name
	          }
	          html = '<li class="ui-state-default task ' + color + '" tid = "' + task.id + '" >'+ env 
	          + '<div class="contener"><span class="title">' + taskTitle + '</span>'
	          + '<div class="' + validClass + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div></div></li>';
	        }
	      return html
	    }
		
	}

	module.exports=TaskList;



/***/ }
/******/ ]);
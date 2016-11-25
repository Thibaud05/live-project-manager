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

	var socket = __webpack_require__(2);
	var tasksManager = __webpack_require__(1);
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
	    updateUserList()
	  }
	})

	socket.on('logoutUser', function (id_user) {
	  tm.users[id_user].logged = false
	  updateUserList()
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

	  updateUserList()
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
	      $(".page").css("padding-top","151px")
	      searchIsOpen = false
	    }else{
	      $( "#search" ).show()
	      $(".page").css("padding-top","197px")
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

	  $( "#online" ).after( tm.getProjects());

	  $("#projects").on('mousedown', 'li a', function(){
	    var idProject = $(this).data('value')
	    tm.toogleProject(idProject)
	    updateUserList()
	    $(this).children( ".glyphicon" ).toggleClass("glyphicon-eye-close").toggleClass("glyphicon-eye-open")
	  });






	  //////////////////////
	  // Accountable selected task
	  $("#dropdownAccountable").mousedown(function() {
	    tm.select = true;
	    console.log("oups")
	  });

	  $("#accountable").on('mousedown', 'li a', function(){

	    var idUser = $(this).data('value')
	    tm.assignAccountable(idUser)
	  });

	  $("#accountable").on('click', 'li a', function(){
	    $( this ).blur()
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

	  $( "#add_btn_task" ).click(function(e) {
	    e.stopPropagation();
	    $('#add_task .project option').remove();
	    $('#add_task .project').html(tm.getProjectList());
	    $('#add_task').toggleClass("hidden")
	  }); 

	  $('#add_btn_release').click(function (e) {
	    e.stopPropagation();
	    $('#add_release').toggleClass("hidden")
	  });

	  $('#add_btn_type').click(function (e) {
	    e.stopPropagation();
	    $('#add_type .project option').remove();
	    $('#add_type .project').html(tm.getProjectList());
	    $('#add_type').toggleClass("hidden")
	  });

	 $('#add_task a').click(function (e) {
	  console.log("addTask")
	  var project = $('#add_task .project').val()
	  tm.newTask(project);
	 })

	 $('#add_release a').click(function (e) {
	  console.log("addRelease")
	 })

	 $('#add_type a').click(function (e) {
	  console.log("addRelease")
	  var id_project = $('#add_type .project').val()
	  var name = $('#add_type input').val()
	  var color = $('#add_type .color').val()
	  socket.emit('addRelease', {name:name,color:color,id_project:id_project});
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

	function updateUserList(){
	  var data = tm.getUsersList()
	  $('#usersLogged').html(data.nb)
	  $('#usersList').html(data.list)
	}

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

	var socket = __webpack_require__(2);
	window.socket = socket
	var user = __webpack_require__(4);
	var file = __webpack_require__(5);
	var link = __webpack_require__(9);
	var task = __webpack_require__(6);
	class tasksManager{
	  constructor(){
	      this.userByProject = [];
	      this.projectByUser = [];
	      this.projectById = []
	      this.tasks = [];
	      this.tasksById = [];
	      this.users = [];
	      this.releases = [];
	      this.releasesById = [];
	      this.taskTypes = [];
	      this.taskTypesByDate = [];
	      this.taskTypeByProject = [];
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
	      this.tasks = [];
	      var self = this
	      data.users.map(function(data,key) {
	        if(data!=undefined){
	          self.users[data.id] = new user(data)
	        }
	      })
	      this.connectUser = this.getUser(this.connectUserId)
	      var tasks_files = {};
	      //console.log(data)
	      data.tasks_files.map(function(data,key ) {
	        if(data!=undefined){
	          if(tasks_files[data.taskId] == undefined ){
	            tasks_files[data.taskId] = [];
	          }
	          tasks_files[data.taskId][data.id] = new file(data);
	        }
	      });
	      var tasks_links = {};
	      //console.log(data)
	      data.tasks_links.map(function(data,key ) {
	        if(data!=undefined){
	          if(tasks_links[data.taskId] == undefined ){
	            tasks_links[data.taskId] = [];
	          }
	          tasks_links[data.taskId][data.id] = new link(data);
	        }
	      });
	      //console.log(tasks_files)
	      data.taskTypes.map(function(taskType,key) {
	        self.taskTypes[taskType.id] = taskType;
	        self.taskTypeByProject[taskType.id_project] = taskType;
	      });

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

	      data.releases.map(function(data,key) {
	        if(data!=undefined){
	          var r = data
	          r.day = moment(data.day).format('YYYY-MM-DD');
	          r.id_project = self.taskTypes[r.typeId].id_project;

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
	      data.tasks.map(function(data,key) {
	        
	        if(data!=undefined){
	          data.id_project = self.taskTypes[data.typeId].id_project;
	          var t = new task(data);
	          

	          if(tasks_files[t.id] != undefined ){
	            t.files = tasks_files[t.id];
	            //log(t.files);
	          }

	          if(tasks_links[t.id] != undefined ){
	            t.links = tasks_links[t.id];
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
	    self.projectByUser[self.connectUser.id].map(function(projectId,key) {
	      self.projectsId[projectId] = true
	      self.userByProject[projectId].map(function(userId,key) {
	          self.users[userId].display = true
	      })
	    });
	  }
	/**
	 *
	 * get the next release
	 *
	 */
	  getNextRelease(typeId,getPrev){
	    var maxRelease = {}
	    this.releasesById.map(function(r,key){
	      if (r){
	        if(maxRelease[r.typeId]!=undefined){
	          if(maxRelease[r.typeId] < r.day){
	            maxRelease[r.typeId] = r.day
	          }
	        }else{
	          maxRelease[r.typeId] = r.day
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
	    this.tasks = [];


	    $.each( this.users, function( key, user ) {
	      if(user){
	        user.display = false
	      }
	    })

	    self.projectByUser[self.connectUser.id].map(function(projectId,key) {
	      if(self.projectsId[projectId]){
	        self.userByProject[projectId].map(function(userId,key) {
	            self.users[userId].display = true
	        })
	      }
	    });

	    this.tasks = [];
	    this.tasksById.map(function(t,key) {
	      if (t){
	        var display = true;
	        if(self.searchValue != ""){
	          display = false;
	          if((t.title.contain(self.searchValue))||(t.description.contain(self.searchValue))){
	            display = true;
	          }
	        }
	        if(display){
	          var k = t.userId + ":" + t.day;
	          if(self.tasks[k] == undefined ){
	            self.tasks[k] = new Array();
	          }
	          self.tasks[k][t.priority] = t;
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
	    t.id_project = this.taskTypes[t.typeId].id_project
	    this.addDOMTask(t);
	    this.tasksById[t.id] = t;
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
	      self.tasksById[t.id] = t;
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
	  newTask(project){
	    var userId = this.connectUserId
	    var day = this.dates[0]
	    var lowPriority = 0
	    if (this.tasks[userId + ":" + day]!=undefined){
	      lowPriority =  this.tasks[userId + ":" + day].length;
	    }

	    var newTask = {
	      "id"                : "",
	      "userId"            : userId,
	      "title"             : "New task",
	      "typeId"            : this.taskTypeByProject[project].id,
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
	      var task =  self.tasksById[id];
	      
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
	        var t = this.tasksById[key]
	        var lowPriority =  this.tasks[t.userId + ":" + t.day].length;
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
	        var t = this.tasksById[key]
	        this.selectedTasks[key].find( ".ok" ).toggleClass("hidden")
	        t.valid = t.valid==1?0:1
	        this.tasksById[key] = t
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
	        if(this.tasks[k] == undefined ){
	          this.tasks[k] = new Array();
	        }

	        this.tasks[k][t.priority] = t;
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
	          var htmlTask = this.renderTask(t);
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
	        var t = this.tasksById[key]
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
	      console.log(userId)
	      var assignTasks = [];
	      for (var key in this.selectedTasks) {
	        var t = this.tasksById[key]
	        t.creationUserId = userId
	        this.tasksById[key] = t
	        assignTasks.push(t);
	      }
	      socket.emit('updateTask', assignTasks);
	    }

	/**
	 *
	 * DISPLAY TASKS
	 *
	 */
	    renderTasks(key){

	      var html = ''
	      var tabTask = this.tasks[key];
	      if(tabTask){
	        for (var i = 0; i < tabTask.length; i++){
	          var t = tabTask[i];
	          if(t!=undefined){
	            if(this.projectsId[t.id_project]){
	              html += this.renderTask(t)
	            }
	          }
	        }
	      }
	      return html;
	    }
	  /**
	 *
	 * DISPLAY TASK
	 *
	 */
	    renderTask(task){
	        var color = this.taskTypes[task.typeId].color;
	        var env = '';
	        if(task.typeId!=5 && task.typeId!=6){
	           env = '<div class="env">' + this.getLastRelease(task.typeId) + '</div>'
	        }
	        var validClass = "ok"
	        if(task.valid!=1){
	          validClass = "ok hidden"
	        }
	        var html = '<li class="ui-state-default task ' + color + '" tid = "' + task.id + '" >'+ env 
	        + '<div class="contener"><span class="title">' + task.title + '</span>'
	        + '<div class="' + validClass + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div></div></li>';
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
	            if(this.projectsId[r.id_project]){
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
	      var taskType = this.taskTypes[release.typeId];
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
	    renderBox(type,idType){ 
	      var html = ''
	      var htmlTasks = this.renderTasks(idType + ":0000-00-00")
	      if(this.searchValue == "" || htmlTasks != ""){
	       
	        html = '<div class="panel panel-default box">';
	        html += '<div class="panel-heading">' + type + '</div>';
	        html +=   '<div class="panel-body">';
	        html +=     '<ul class="connectedSortable" di = "-1" uid ="' + idType + '">' 
	        html +=       this.renderTasks(idType + ":0000-00-00")
	        html +=     '</ul>'
	        html +=   '</div>';
	        html += '</div>';
	      }
	      return html;
	    }

	/**
	 *
	 * DISPLAY COMPONANT
	 *
	 */
	    render(){
	      //log(this.tasks)

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
	          line += '<td class="firstCol" >' + user.firstName + '</td>';
	          for (i = 0; i < self.nbdays; i++){
	            var index = i % self.dayPerWeek;
	            var css = ( index==0 ) ? ' class="leftSep"' : '';
	            line += '<td' + css + '><ul class="connectedSortable" di = "' + i + '" uid ="'+ user.id +'">';

	            var htmlTask = self.renderTasks(user.id + ":" + self.dates[i]);
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
	      var htmlBox = this.renderBox("ALPHA",4) + this.renderBox("DEV",1) +  this.renderBox("QA",2) + this.renderBox("PRD",3)
	      if(this.searchValue!=""){
	        htmlBox += this.renderBox("ARCHIVE",5)
	      }
	      $("#box").html(htmlBox);
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
	        var t = self.tasksById[data.id]
	        t.update(data)
	        self.addDOMTask(t);
	        self.tasksById[t.id] = t;
	        self.activate();
	      })

	/*----------  setData  ----------*/
	      socket.on('setData', function (data)
	      {
	        var t = self.tasksById[data.id];
	        t.update(data)
	        var k = t.userId + ":" + t.day
	        var selectedTask = $(".task[tid="+ t.id +"]")

	        if (selectedTask) {
	          selectedTask.find( ".title" ).html(t.getTitle())
	          selectedTask.find( ".desc" ).html(t.getDescription())
	        }
	        self.tasksById[t.id].title = t.title;
	        self.tasksById[t.id].description = t.description;
	        if(self.tasks[k] == undefined ){
	          self.tasks[k] = new Array();
	        }
	        self.tasks[k][t.priority] = self.tasksById[t.id];
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
	        var t =  self.tasksById[id];
	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if (selectedTask) {
	          selectedTask.remove();
	        }
	        delete self.tasksById[id];
	        delete self.selectedTasks[id];

	        log("taskRemoved");
	      })

	/*----------  duplicateTask ----------*/
	      socket.on('duplicateTask', function (data)
	      {
	        data.id_project = self.taskTypes[data.typeId].id_project;
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
	        data.id_project = self.taskTypes[data.typeId].id_project;
	        var t = self.tasksById[data.id];
	        t.update(data)

	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if (selectedTask) {
	          if(t.valid == 0){
	            selectedTask.find( ".ok" ).addClass("hidden")
	          }else{
	            selectedTask.find( ".ok" ).removeClass("hidden")
	          }
	        }
	        self.tasksById[t.id].valid = t.valid
	      })

	/*----------  archiveTask ----------*/
	      socket.on('archiveTask', function (data)
	      {
	        var t = self.tasksById[data.id];
	        t.update(data)
	        var selectedTask = $(".task[tid="+ t.id +"]")
	        if (selectedTask) {
	          selectedTask.remove();
	        }
	        self.tasksById[t.id] = t
	      })

	/*----------  delDataFiles  ----------*/
	      socket.on('delDataFiles', function (data)
	      {
	        var id = data.id
	        var selectedFile = $(".file > a[fid=" + id + "]").parent()
	        if (selectedFile) {
	          selectedFile.remove();
	        }
	        delete self.tasksById[data.taskId].files[id]
	      })

	/*----------  setDataFiles  ----------*/
	      socket.on('setDataFiles',function(data)
	      {
	        var f = new file(data)
	        var divFiles = $(".task[tid=" + f.taskId + "] .files")
	        if(divFiles){
	          divFiles.append(f.display())        
	          $('.removeFile').click(function(){
	            var fid = $(this).attr('fid');
	            var parent = $(this).parent();
	            socket.emit('delDataFiles',f);
	          });
	        }
	        self.tasksById[f.taskId].files[f.id] = f
	      })

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

	          var oldTypeID = self.tasksById[t.id].typeId
	          console.log("oldTypeID " + oldTypeID)
	          console.log("TypeID " + t.typeId)
	          var oldColor = self.taskTypes[oldTypeID].color;
	          var newColor = self.taskTypes[t.typeId].color;
	          var newEnv = self.getLastRelease(t.typeId)
	          selectedTask.removeClass( oldColor )
	          selectedTask.addClass( newColor )
	          selectedTask.find( ".env" ).html(newEnv)
	        }
	        self.tasksById[t.id].typeId = t.typeId
	      })

	/*----------  addRelease  ----------*/
	      socket.on('addRelease',function(r)
	      {
	          console.log(r)
	          // Ajout de la release dans le tableau de release indexé par id
	          self.releasesById[r.id] = r
	          console.log(self.releasesById)
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
	          self.taskTypes[taskType.id] = taskType
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
	          var t = self.tasksById[ui.item.attr("tid")];
	          t.isDraging = true;
	        },
	        stop( event, ui ) {
	          //log("stop")
	          var t = self.tasksById[ui.item.attr("tid")];
	          t.isDraging = false;
	        },
	        update:function( event, ui ) {
	          //log("CLIENT MOVE TASK")
	          var tasksToUpdate = $(this).sortable('toArray', {attribute: 'tid'})
	          var tasksUpdate = []
	          tasksToUpdate.map(function(id,pos){
	            var t = self.tasksById[id];
	            t.priority = pos
	            tasksUpdate.push(t)
	          })
	          //log(tasksUpdate)
	          socket.emit('moveTask', tasksUpdate);
	        },
	        receive( event, ui ) {
	          //log("recive");
	          var t = self.tasksById[ui.item.attr("tid")];
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
	        var t =  self.tasksById[id];
	        if(! t.isOpen){
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
	        var t =  self.tasksById[id];
	        if(!t.isDraging){
	        $(this).removeClass('selected');
	        if(! t.isOpen){

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
	          var t = self.tasksById[idTask];
	          var color = self.taskTypes[t.typeId].color;
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
	      var self = this
	      var html = '<div class="btn-group">' + 
	      '<button id="dropdownProjects" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"' +
	      ' aria-haspopup="true" aria-expanded="true" title="Mes projets">' + 
	      '<span class="glyphicon glyphicon-th" aria-hidden="true"></span></button>' + 
	      '<ul id="projects" class="dropdown-menu" aria-labelledby="dropdownProjects">'

	      self.projectByUser[self.connectUser.id].map(function(projectId,key) {
	        var icon = '<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span></button>'
	        if(self.projectsId[projectId]){
	          icon = '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'
	        }
	        html += '<li><a href="#" data-value="' + projectId + '">' + icon + ' ' + self.getProjectTitle(projectId) + '</a></li>'
	      });
	      return html + '</li></ul></div>'
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

	    getProjectList(){
	      var self = this;
	      var html = '';
	      self.projectByUser[self.connectUser.id].map(function(projectId,key) {
	        html += '<option value="' + projectId + '">' + self.getProjectTitle(projectId) + '</option>';
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
	            console.log(user.logged)
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(3);
	let instance = null;
	class socket{  
	    constructor() {
	        if(!instance){
	              instance = io.connect(config.host);;
	        }
	        return instance;
	      }
	}
	module.exports = new socket();

/***/ },
/* 3 */
/***/ function(module, exports) {

	var host = 'http://127.0.0.1:3000';

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

	var socket = window.socket
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
	    this.priority = data.priority
	    this.w = 0
	    this.h = 0
	    this.valid = data.valid
	    this.initPosition
	    this.id_project = data.id_project
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

	      var html = '<div id="taskDetail"><div id="closeTask"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>';

	  html +='<div id="upload">' + self.getAttachBtn() + '</div>';

	  html += self.displayFiles();
	      moment.locale('fr');
	      html += '<p><button id="shifting_prev" type="button" class="btn btn-default" title="Avancer à la release précédente">' +
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

	      self.attachBtnOnClcik();

	      $('.removeFile').click(function(){
	        var fid = $(this).attr('fid');
	        var parent = $(this).parent();
	        socket.emit('delDataFiles', self.files[fid]);
	      });
	      
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
	        html += '<input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon"></div>';
	        html += '<div class="input-group"><span class="input-group-addon" id="basic-addon2">Link</span>';
	        html += '<input type="text" class="form-control" id="basic-url2" aria-describedby="basic-addon2"></div></div>';
	        html += '<button id="remove_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-remove"></i></span></button>';
	        html += '<button id="ok_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-ok"></i></span></button>';
	        html += self.getProgressBar();
	        $("#upload").html(html);

	        $("#remove_btn").click(function() {
	          $("#upload").html(self.getAttachBtn());
	          self.attachBtnOnClcik();
	        }); 
	      });
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
	      return html + '<div class="clear"></div></div>';
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
/* 7 */,
/* 8 */,
/* 9 */
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
	    html += ' | <a href="#" fid="' + this.id + '" class="removeLink" title="Remove link">X</a>D';
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

/***/ }
/******/ ]);
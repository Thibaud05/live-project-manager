var socket = require("./socket.js");
var user = require("./user.js");
var file = require("./file.js");
var file = require("./task.js");

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
          log("click out")
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
          log("start")
          var t = self.tasksById[ui.item.attr("tid")];
          t.isDraging = true;
        },
        stop( event, ui ) {
          log("stop")
          var t = self.tasksById[ui.item.attr("tid")];
          t.isDraging = false;
        },
        update:function( event, ui ) {
          log("CLIENT MOVE TASK")
          var tasksToUpdate = $(this).sortable('toArray', {attribute: 'tid'})
          var tasksUpdate = []
          tasksToUpdate.map(function(id,pos){
            var t = self.tasksById[id];
            t.priority = pos
            tasksUpdate.push(t)
          })
          log(tasksUpdate)
          socket.emit('moveTask', tasksUpdate);
        },
        receive( event, ui ) {
          log("recive");
          var t = self.tasksById[ui.item.attr("tid")];
          t.day = self.dates[$(this).attr("di")];
          t.userId = $(this).attr("uid");
          //t.creationUserId = self.connectUserId;
          socket.emit('setData', t);
        }
      }).disableSelection();

/*----------  Task click ----------*/
      $( ".connectedSortable > li" ).mousedown(function(e,obj) {
        log("down");
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
          log("selected");
          var selectedTask = $(this);
          selectedTask.addClass('selected');
          self.selectedTasks[selectedTask.attr("tid")] = selectedTask;
        }
      });

/*----------  Task double click ----------*/
      $( ".connectedSortable > li" ).dblclick(function() {
        log("dbleclick");
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
      log(this.now.format('MMMM Do YYYY'));
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
module.exports = tasksManager;
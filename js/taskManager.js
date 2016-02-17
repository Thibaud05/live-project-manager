/**
 *
 * TASKMANAGER OBJECT
 *
 */
  function tasksManager(){
    this.tasks = [];
    this.tasksById = [];
    this.users = [];
    this.releases = [];
    this.releasesById = [];
    this.taskTypes = [];
    this.taskTypesByDate = [];
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
}
tasksManager.prototype = {
  /**
 *
 * CONTROLLER
 *
 */
    init: function(){
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
    },
/**
 *
 * LOAD DATA
 *
 */
    getData: function(data){
      //console.log(data)
        this.connectUserId = data.connectUserId;
        this.fullUrl = data.fullUrl;
        this.tasks = [];
        var self = this
        $.each( data.users, function( key, data ) {
          self.users[data.id] = new user(data);
        });
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
          self.taskTypesByDate[taskType.day] = taskType;
        });
        data.releases.map(function(data,key) {
          if(data!=undefined){
            var r = data
            r.day = moment(data.day).format('YYYY-MM-DD');
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
          //log(data);
          if(data!=undefined){
            var t = new task(data);

            if(tasks_files[t.id] != undefined ){
              t.files = tasks_files[t.id];
              //log(t.files);
            }
            self.tasksById[t.id] = t;
            var k = t.userId + ":" + t.day;
            if(self.tasks[k] == undefined ){
              self.tasks[k] = new Array();
            }
            self.tasks[k][t.priority] = t;
          }
        });
    },
/**
 *
 * get the next release
 *
 */
    getNextRelease : function(typeId,getPrev){
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
    },
/**
 *
 * SYNCRONISE DATA
 *
 */
    sync: function(){

      var self = this
      this.tasks = [];

      this.tasksById.map(function(t,key) {
        if (t){
          var k = t.userId + ":" + t.day;
          if(self.tasks[k] == undefined ){
            self.tasks[k] = new Array();
          }
          self.tasks[k][t.priority] = t
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

    },
/**
 *
 * GET USER
 *
 */
    getUser :function (id){
      if(this.users[id] != undefined) {
        return this.users[id];
      }
    },
/**
 *
 * GET LAST RELEASE
 *
 */
    getLastRelease :function (typeId){
      var r = this.lastRelease[typeId]
      if(r != undefined && r.name != "α") {
        return r.name;
      }else{
        return "ALPHA";
      }
    },
/**
 *
 * ADD TASK
 *
 */
    addTask :function (t){
      this.tasksById[t.id] = t;
      this.init();
      this.sync();
      this.render();
      this.activate();
    },
/**
 *
 * ADD MANY TASKS
 *
 */
    addTasks :function (datas){
      var self = this
      datas.map(function( data, key ) {
        var t = new task(data)
        self.tasksById[t.id] = t;
      });
      this.init();
      this.sync();
      this.render();
      this.activate();
    },
/**
 *
 * SAVE INDICATOR
 *
 */
    save: function(){
      var html =  '<div class="dataSaved">'
      html +=       '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'
      html +=     '</div>'
      $( "body" ).append(html);
      $(".dataSaved").animate({opacity:1}).animate({opacity:0},400,function() {
        $(".dataSaved").remove();
      });
    },
/**
 *
 * CREATE A NEW TASK
 *
 */
    newTask: function()
    {
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
        "typeId"            : this.taskTypes.length-1,
        "day"               : day,
        "description"       : "",
        "creationUserId"    : userId,
        "priority"          : lowPriority,
        "accountableUserId" : userId,
        "creationDate"      : "",
        "valid"             : false
      };
      socket.emit('addTask', newTask);
    },
/**
 *
 * Delete selected task
 *
 */
    delSelectedTasks: function (){
      var removedTasksId = [];
      var self = this
      $.each(self.selectedTasks, function( key, t ) {
        var id = t.attr("tid");
        var task =  self.tasksById[id];
        
        if(!task.isOpen){
          removedTasksId.push({"id":id,"id_user":"","title":"","typeId":"","day":""});
        }
      });
      socket.emit('delTask', removedTasksId);
    },
/**
 *
 * Duplicte task
 *
 */
    duplicateTask: function (){
      var duplicatedTasksId = [];
      for (var key in this.selectedTasks) {
        var t = this.tasksById[key]
        var lowPriority =  this.tasks[t.userId + ":" + t.day].length;
        duplicatedTasksId.push({
          "id"               : "",
          "userId"            : t.userId,
          "title"             : t.title,
          "typeId"            : t.typeId,
          "day"               : t.day,
          "description"       : t.description,
          "creationUserId"    : this.connectUserId,
          "priority"          : lowPriority,
          "accountableUserId" : this.connectUserId,
          "creationDate"      : "",
          "valid"             : false
        });
      }
      socket.emit('duplicateTask', duplicatedTasksId);
    },
/**
 *
 * Valid task
 *
 */
    validTask: function (){
      var validTasks = [];
      for (var key in this.selectedTasks) {
        var t = this.tasksById[key]
        this.selectedTasks[key].find( ".ok" ).toggleClass("hidden")
        t.valid = t.valid==1?0:1
        this.tasksById[key] = t
        validTasks.push(t);
      }
      socket.emit('updateTask', validTasks);
    },
/**
 *
 * Archive task
 *
 */
    archiveSelectedTasks: function (){
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
    },
/*----------  DUPLICATE TASK  ----------*/
    extendTask: function (){
      var extendTasks = [];
      for (var key in this.selectedTasks) {
        var t = this.tasksById[key]


        this.selectedTasks[key].find( ".ok" ).toggleClass("hidden")
        t.valid = t.valid==1?0:1
        this.tasksById[key] = t
        validTasks.push(t);
      }
      socket.emit('updateTask', JSON.stringify(extendTasks));
    },
/**
 *
 * DISPLAY TASKS
 *
 */
    renderTasks: function(key){

      var html = ''
      var tabTask = this.tasks[key];
      //console.log(key)
      if(tabTask){
        console.log("rendretask")
        for (var i = 0; i < tabTask.length; i++){
          var t = tabTask[i];
          if(t!=undefined){
            html += this.renderTask(t)
          }
        }
      }
      return html;
    },
  /**
 *
 * DISPLAY TASK
 *
 */
    renderTask: function(task){
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
    },
/**
 *
 * DISPLAY RELEASES
 *
 */
    renderReleases: function(key){
      var html = ''
      var tabRelease = this.releases[key];
      if(tabRelease){
        for (var i = 0; i < tabRelease.length; i++){
          var r = tabRelease[i];
          if(r!=undefined){
            html += this.renderRelease(r)
          }
        } 
      }
      return html;
    },
/**
 *
 * DISPLAY RELEASE
 *
 */
    renderRelease: function(release){
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
    },
/**
 *
 * DISPLAY BOX
 *
 */
    renderBox: function(type,idType){
      var html = ''
      html = '<div class="panel panel-default box">';
      html += '<div class="panel-heading">' + type + '</div>';
      html +=   '<div class="panel-body">';
      html +=     '<ul class="connectedSortable" di = "-1" uid ="' + idType + '">' 
      html +=       this.renderTasks(idType + ":0000-00-00")
      html +=     '</ul>'
      html +=   '</div>';
      html += '</div>';
      return html;
    },

/**
 *
 * DISPLAY COMPONANT
 *
 */
    render: function(){
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
        if(user){

          var line  = "<tr>";
          line += '<td class="firstCol" >' + user.firstName + '</td>';
          for (i = 0; i < self.nbdays; i++){
            var index = i % self.dayPerWeek;
            var css = ( index==0 ) ? ' class="leftSep"' : '';
            line += '<td' + css + '><ul class="connectedSortable" di = "' + i + '" uid ="'+ user.id +'">';
            line += self.renderTasks(user.id + ":" + self.dates[i]);
            line += '</div></td>';
          }
          line += "</tr>";
          if(user.id == self.connectUserId){
            firstLine = line;
          }else{
            lines += line;
          }
        }
      });
      html += firstLine;
      if(this.connectUser.level!=0){
        html += lines;
      }
      $("#tasksManagerHead").html('<table class="table" width="100%" cellspacing="0">' + htmlHead + '</table>');
      $("#tasksManager").html('<table class="table" width="100%" cellspacing="0">' + html + '</table>');
      $("#box").html(this.renderBox("ALPHA",4) + this.renderBox("DEV",1) +  this.renderBox("QA",2) + this.renderBox("PRD",3));
    },

/**
 *
 * Sockets
 * Get all event from the server
 *
 */
    sockets :function(){
      var self = this
/*----------  moveTask ----------*/
      socket.on('moveTask', function (task)
      {
        var k = task.userId + ":" + task.day
        self.tasks[k]
        if(self.tasks[k] == undefined ){
          self.tasks[k] = new Array();
        }
        self.tasks[k][task.priority] = task;
        var selectedTask = $(".task[tid="+ task.id +"]")
        if (selectedTask) {
          selectedTask.remove()
        }
        var cible = $(".connectedSortable[di="+ self.datesIndex[task.day] +"][uid="+ task.userId +"]")
        if(cible){
          var htmlTask = self.renderTask(task);
          cible.append(htmlTask)
        }
        self.tasksById[task.id] = task;
      })

/*----------  setData  ----------*/
      socket.on('setData', function (data)
      {
        var t = new task(data);
        var selectedTask = $(".task[tid="+ t.id +"]")
        if (selectedTask) {
          selectedTask.find( ".title" ).html(t.title)
          selectedTask.find( ".desc" ).html(t.description)
        }
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
        var t = new task(data);
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
        var t = new task(data);
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
          var url = 'img/user/'+ self.connectUserId +'.jpg?' + moment().unix()
          $(".avatar").attr("src", url )
          $(".bgAvatar").css("background","url(" + url + ")")
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

/*----------  changeRelease  ----------*/
      socket.on('addRelease',function(data)
      {
        console.log('addRelease')
        console.log(data)
      })
    },

/**
 *
 * JQUERY INITIALISATION
 *
 */
    activate :function(){
      // Task drag and drop
      var self = this
      $( "body" ).off().mousedown(function(e) {
          //log("click out")
          if(!self.select){
            $.each(self.selectedTasks, function( key, t ) {
              t.removeClass('selected');
              delete self.selectedTasks[t.attr("tid")];
            });
          }
          self.select = false;
      })

      $( ".connectedSortable" ).sortable({
        revert:150,
        cancel: ".disable-task",
        placeholder: "ui-sortable-placeholder",
        connectWith: ".connectedSortable",
        start: function( event, ui ) {
          log("start")
          var t = self.tasksById[ui.item.attr("tid")];
          t.isDraging = true;
        },
        stop: function( event, ui ) {
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
        receive: function( event, ui ) {
          log("recive");
          var t = self.tasksById[ui.item.attr("tid")];
          t.day = self.dates[$(this).attr("di")];
          t.userId = $(this).attr("uid");
          t.creationUserId = self.connectUserId;
          socket.emit('setData', t);
        }
      }).disableSelection();

/*----------  Task click ----------*/
      $( ".connectedSortable > li" ).mousedown(function(e,obj) {
        log("down");
        //e.stopPropagation();
        self.select = true;
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
        content: function(){
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
        receive: function( event, ui ) {
          var r = self.releasesById[ui.item.attr("tid")];
          r.day = self.dates[$(this).attr("di")];
          socket.emit('setRelease', r);
        }
      }).disableSelection();
    },

/**
 *
 * CHANGE WEEK
 *
 */
    changeInterval: function(nbWeek){
      log(this.now.format('MMMM Do YYYY'));
      this.now = this.now.add(nbWeek,'w');
      this.init();
      this.sync();
      this.render();
      this.activate();
    },
/**
 *
 * LOGOUT
 *
 */
    logout(){
      socket.emit('logout', connectUser);
    }

  }

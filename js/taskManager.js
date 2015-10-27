  //////////////////////////////////////////
  //
  //  TASKMANAGER OBJECT
  //
  //////////////////////////////////////////

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
    this.offset;
    this.selectedTasks = {};
    this.connectUserId;
    this.connectUser;
    this.fullUrl;
}
    /////////////////////
    // CONTROLLER
tasksManager.prototype = {
    init: function(){
      this.week = this.now.week();
      this.firstDayWeek = this.now.day(1);
      this.dates = [];
      for (var i = 0; i < this.nbdays; i++){
        var offset = Math.floor(i / this.dayPerWeek);
        offset = offset * (7-this.dayPerWeek);
        this.dates[i] = this.firstDayWeek.clone().add(i + offset,'d').format('YYYY-MM-DD');
      }
    },

    /////////////////////
    // LOAD DATA 

    getData: function(){
      var self = this
      var getJSON = $.getJSON( "data.php", function( data ) {
        
        self.connectUserId = data.connectUserId;
        self.fullUrl = data.fullUrl;
        self.tasks = [];

        $.each( data.users, function( key, data ) {
          self.users[data.id] = new user(data);
        });
        self.connectUser = self.getUser(self.connectUserId)
        var tasks_files = {};
        
        data.tasks_files.map(function(data,key ) {
          if(tasks_files[data.id_task] == undefined ){
            tasks_files[data.id_task] = [];
          }
          tasks_files[data.id_task][data.id] = new file(data);
        });

        data.taskTypes.map(function(taskType,key) {
          self.taskTypes[taskType.id] = taskType;
          self.taskTypesByDate[taskType.day] = taskType;
        });

        data.releases.map(function(release,key) {
          self.releases[release.day] = release;
          self.releasesById[release.id] = release;
        });

        data.tasks.map(function(data,key) {
          //log(data);
          var t = new task(data);
          
          if(tasks_files[t.id] != undefined ){
            t.files = tasks_files[t.id];
            //log(t.files);
          }
          self.tasksById[t.id] = t;
          var k = t.id_user + ":" + t.day;
          if(self.tasks[k] != undefined ){
            self.tasks[k].push(t);
            
          }else{
            self.tasks[k] = new Array(t);
          }
        });
      });
      return getJSON;
    },

    /////////////////////
    // SYNCRONISE DATA 

    sync: function(){
      this.tasks = [];
      this.tasksById.map(function(t,key) {
        if (t){
          var k = t.id_user + ":" + t.day;
          if(this.tasks[k] != undefined ){
            this.tasks[k].push(t);
          }else{
            this.tasks[k] = new Array(t);
          }
        }
      });

      this.releases = [];
      this.releasesById.map(function(release,key) {
        if (release){
          var k =  release.day;
          this.releases[k] = release;
        }
      });
    },
    getUser :function (id){
      if(this.users[id] != undefined) {
        return this.users[id];
      }
    },
    /////////////////////
    // ADD TASK 

    addTask :function (t){
      this.tasksById[t.id] = t;
      this.init();
      this.sync();
      this.render();
      this.activate();
    },

    addTasks :function (datas){
      datas.map(function( data, key ) {
        var t = new task(data)
        this.tasksById[t.id] = t;
      });
      this.init();
      this.sync();
      this.render();
      this.activate();
    },

    save: function(){
      $( "body" ).append('<div class="dataSaved"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>');
      $(".dataSaved").animate({opacity:1}).animate({opacity:0},400,function() {
        $(".dataSaved").remove();
      });
    },

    /////////////////////
    // DELETE TASK

    delSelectedTasks: function (){
      var removedTasksId = [];
      var self = this
      $.each(self.selectedTasks, function( key, t ) {
        var id = t.attr("tid");
        t.remove();
        delete self.tasksById[id];
        delete self.selectedTasks[id];
        removedTasksId.push({"id":id,"id_user":"","title":"","id_type":"","day":""});
      });
      $.ajax({
        url: "data.php",
        dataType: "json",
        data: {
          a: "delTask",
          obj:JSON.stringify(removedTasksId)
        },
        success: function( t ) {
          log("taskRemoved");
        }
      });
    },

    /////////////////////
    // DUPLICATE TASK

    duplicateTask: function (){
      var duplicatedTasksId = [];
      for (var key in this.selectedTasks) {
        var t = this.tasksById[key]
        duplicatedTasksId.push({"id":"","id_user":t.id_user,"title":t.title,"id_type":t.id_type,"day":t.day,"description":t.description,"creationUser":connectUserId});
      }
      $.ajax({
        url: "data.php",
        dataType: "json",
        data: {
          a: "duplicateTask",
          obj:JSON.stringify(duplicatedTasksId)
        },
        success: function( data ) {
          tasksManager.addTasks(data);
        }
      });
    },


    /////////////////////
    // DISPLAY TASK  

    renderTask: function(key){
      var html = ''
      var tabTask = this.tasks[key];

      if(tabTask){
        for (var i = 0; i < tabTask.length; i++){
          var t = tabTask[i];
          var color = this.taskTypes[t.id_type].color;
          html += '<li class="ui-state-default task ' + color + '" tid = "' + t.id + '" ><span>' + t.title + '</span></li>';
        }
      }
      return html;
    },

    /////////////////////
    // DISPLAY RELEASE    

    renderRelease: function(key){
      var html = ''
      var release = this.releases[key];
      if(release){
        var taskType = this.taskTypes[release.id_type];
        if(taskType){
          html += '<li class="ui-state-default release ' + taskType.color + '" tid = "' + release.id + '" ><span>';
          html += '<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> ';
          html +=  taskType.name + ' ' + release.name;
          html += ' <span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>';
          html +=  '</span></li>';
        }
      }
    return html;
    },

    /////////////////////
    // DISPLAY BOX    

    renderBox: function(type,idType){
      var html = ''
      html = '<div class="panel panel-default box">';
      html += '<div class="panel-heading">' + type + '</div>';
      html +=   '<div class="panel-body">';
      html +=     '<ul class="connectedSortable" di = "' + type + '" uid ="' + idType + '">' + this.renderTask(idType + ":0000-00-00") + '</ul>';
      html +=   '</div>';
      html += '</div>';
      return html;
    },

    /////////////////////
    // DISPLAY COMPONANT

    render: function(){
      log(this)
      
      var self = this;
      var html = "";
      var htmlHead = "";

      // Week row
      htmlHead += '<tr class="week"><td class="firstCol"></td>';
      for (i = 0; i < this.nbWeekPerScreen; i++){
        htmlHead += '<td class="leftSep" colspan="' + this.dayPerWeek + '">W' + (i + this.week) + '</td>';
      }
      htmlHead += "</tr>";
    
      // Realeases row
      htmlHead += '<tr class="day"><td></td>';
      for (var i = 0; i < this.nbdays; i++){
        var index = i % this.dayPerWeek;
        var css = ( index==0 ) ? 'leftSep' : '';
        htmlHead += '<td  class="' + css + '"><ul class="releaseSlot" di = "' + i + '">' + this.renderRelease(this.dates[i]) + '</ul></td>';
      }
      htmlHead += "</tr>";

      // Days row 
      htmlHead += '<tr class="day"><td></td>';
      for (var i = 0; i < this.nbdays; i++){
        var index = i % this.dayPerWeek;
        var css = ( index==0 ) ? ' class="leftSep"' : '';
        htmlHead += '<td' + css + '>' + this.days[index] + '</td>';
      }
      htmlHead += "</tr>";

      // Rows tasks
      var lines = "";
      var firstLine = "";
      $.each( this.users, function( key, user ) {
        if(user){
          
          var line  = "<tr>";
          line += '<td class="firstCol" >' + user.firstname + '</td>';
          for (i = 0; i < self.nbdays; i++){
            var index = i % self.dayPerWeek;
            var css = ( index==0 ) ? ' class="leftSep"' : '';
            line += '<td' + css + '><ul class="connectedSortable" di = "' + i + '" uid ="'+ user.id +'">';
            line += self.renderTask(user.id + ":" + self.dates[i]);
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

    /////////////////////
    // JQUERY INITIALISATION

    activate :function(){

      // Task drag and drop
      var self = this
      $( ".connectedSortable" ).sortable({
        revert:150,
        cancel: ".disable-task",
        connectWith: ".connectedSortable",
        receive: function( event, ui ) {
          var t = self.tasksById[ui.item.attr("tid")];
          t.day = self.dates[$(this).attr("di")];
          t.id_user = $(this).attr("uid");
          t.creationUser = self.connectUserId;
          $.ajax({
            url: "data.php",
            data: {
              a: "setData",
              obj:JSON.stringify(t)
            },
            success: function( data ) {
              log("saved");
            }
          });
        }
      }).disableSelection();

      // Task click
      $( ".connectedSortable > li" ).mousedown(function(e,obj) {
        log(e)
        log(obj)
        log(this)
        log(self)
        var id = $(this).attr("tid");
        var t =  self.tasksById[id];
        if(! t.isOpen){
          if(!e.ctrlKey){
            $.each(self.selectedTasks, function( key, t ) {
              t.removeClass('selected');
              delete self.selectedTasks[t.attr("tid")];
            });
          }
          var selectedTask = $(this);
          selectedTask.addClass('selected');
          self.selectedTasks[selectedTask.attr("tid")] = selectedTask;
        }
      });

      // Task double click
      $( ".connectedSortable > li" ).dblclick(function() {
        var id = $(this).attr("tid");
        var t =  self.tasksById[id];
        $(this).removeClass('selected');
        if(! t.isOpen){
          t.open($(this));
        }/*else{
          task.close($(this));
        }*/
      });

      // Task tooltip
      $( ".task" ).tooltip({
        items: "li",
        content: function(){
          var element = $( this );
          var idTask = element.attr("tid");
          var t = self.tasksById[idTask];
          var color = self.taskTypes[t.id_type].color;
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

      // Release drag and drop
      $( ".releaseSlot" ).sortable({
        revert:150,
        connectWith: ".releaseSlot",
        receive: function( event, ui ) {
          var release = self.releasesById[ui.item.attr("tid")];
          release.day = self.dates[$(this).attr("di")];
          $.ajax({
            url: "data.php",
            data: {
              a: "setRelease",
              obj:JSON.stringify(release)
            },
            success: function( data ) {
              log("saved0");
            }
          });
        }
      }).disableSelection();
    },

    /////////////////////
    // CHANGE WEEK

    changeInterval: function(nbWeek){
      log(this.now.format('MMMM Do YYYY'));
      this.now = this.now.add(nbWeek,'w');
      this.init();
      this.sync();
      this.render();
      this.activate();
    }
  }
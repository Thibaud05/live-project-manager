$(function() {
  /*
    BOOTSTRAP MODAL FIX
    http://gurde.com/stacked-bootstrap-modals/
  */

  $(document)  
    .on('show.bs.modal', '.modal', function(event) {
      $(this).appendTo($('body'));
    })
    .on('shown.bs.modal', '.modal.in', function(event) {
      console.log("ok");
      console.log("///");
      setModalsAndBackdropsOrder();
    })
    .on('hidden.bs.modal', '.modal', function(event) {
      console.log("ok2");
      setModalsAndBackdropsOrder();
    });

  function setModalsAndBackdropsOrder() {  
    var modalZIndex = 1040;
    $('.modal.in').each(function(index) {
      var $modal = $(this);
      modalZIndex++;
      $modal.css('zIndex', modalZIndex);
      $modal.next('.modal-backdrop.in').addClass('hidden').css('zIndex', modalZIndex - 1);
  });
    $('.modal.in:visible:last').focus().next('.modal-backdrop.in').removeClass('hidden');
  }

  var debug = true;

  function log(msg){
    if(debug){
      console.log(msg);
    }
  }


  //////////////////////////////////////////
  //
  //  USER OBJECT
  //
  //////////////////////////////////////////

  function user(data){
    this.id = data.id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;

    /////////////////////
    //  Nom complet 

    this.getName = function(){
      return this.firstname + " " + this.lastname;
    }
  }


  //////////////////////////////////////////
  //
  //  TASK OBJECT
  //
  //////////////////////////////////////////

  function task(data){

    var self = this;
    this.isOpen = false;
    this.id = data.id;
    this.id_type = data.id_type;
    this.id_user = data.id_user;
    this.day = data.day;
    this.creationDate;
    this.creationUser;
    this.title = data.title;
    this.description = data.description;

    /////////////////////
    //  affichage du detail d'une tache

    this.open = function(htmlTask){ 
      var description = this.description;
      if (description == ""){description = "Sans descriptif";}
      if (this.title == ""){htmlTask.children("span").html("Sans titre");}

      htmlTask.css("position","absolute");
      var p = htmlTask.position();
      this.initPosition = p;  
      htmlTask.css({
        "z-index":1000,
        "left":p.left,
        "top":p.top,
        "cursor":"default"
      });
      htmlTask.animate({
        left:0,
        top:0,
        width:  "100%",
        height:  "100%",
      }, 400, function() {
        htmlTask.css({"text-align":"left"});
        htmlTask.children("span").css({"display":"block"});
        var html = '<div id="taskDetail"><div id="closeTask">X</div>';
        html += '<p>Céer par ' + self.getCreationUser() + ' aujourd’hui<p>';
        html += '<p class="desc">' + description + '<p>';
        html += '</div>';
        htmlTask.append(html);
        $("#closeTask").click(function() {
          self.close(htmlTask);
        });
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
                self.save(htmlTask); 
                if (content == ""){content = "Sans descriptif";}
                $(parent).html(content);
              });
          }
        });

      });
      htmlTask.children("span").css({
        "vertical-align": "initial",
        "text-align": "left",
         "margin-left":"20px"
      });
      htmlTask.children("span").animate({
        "font-size": "60px"
      });

        // Edition du titre 
      htmlTask.children("span").dblclick(function() {
        if(!this.editMode){
          var parent = this;
          var content = $(this).html();
          if (content == "Sans titre"){content = "";}
          $(this).html("<input type='text' value='" + content + "' />");
          $(this).children("input").focus();
          $(this).children("input").select();
          this.editMode = true;
          $(this).children("input").blur(function() {
            content = $(this).html();  
            parent.editMode = false;
            self.save(htmlTask);
            self.title = content;
            if (content == ""){content = "Sans titre";}
            $(parent).html(content);
          });
        }
      });










      this.isOpen = true;
      htmlTask.addClass('disable-task');
    }



    /////////////////////
    // masquage du details de la tache

    this.close = function(htmlTask){
      var p = this.initPosition;
      htmlTask.children("#taskDetail").remove();
      htmlTask.children("span").unbind('dblclick');
      htmlTask.animate({
        left:p.left,
        top:p.top,
        width:  100,
        height:  100
      }, 400, function() {
        htmlTask.css({
          "position":"static",
          "z-index":"auto"
        });
        htmlTask.children("span").css({"display":"table-cell"});
      });
      htmlTask.children("span").css({
        "vertical-align": "middle",
        "text-align": "center"
      });
      htmlTask.children("span").animate({
        "font-size": "16px"
      });
      this.isOpen = false;
      htmlTask.removeClass('disable-task');
    }

    /////////////////////
    // affichage du nom de l'utilisateur

    this.getCreationUser = function(){
      var user = tasksManager.getUser(this.id_user);
      return user.getName();
    }

    /////////////////////
    // Sauvegarde d'une tache

    this.save = function(htmlTask){
      $.ajax({
        url: "data.php",
        data: {
          a: "setData",
          obj:JSON.stringify(this)
        },
        success: function( data ) {
          tasksManager.save();
        }
      });
    }
}


  //////////////////////////////////////////
  //
  //  TASKMANAGER OBJECT
  //
  //////////////////////////////////////////

  function tasksManager(){
    var tasks = [];
    var tasksById = [];
    var users = [];
    var releases = [];
    var releasesById = [];
    var taskTypes = [];
    var taskTypesByDate = [];
    var nbWeekPerScreen = 3;
    var dayPerWeek = 5;
    var nbdays = nbWeekPerScreen*dayPerWeek;
    var days = ["L","M","M","J","V","S","D"];
    var now = moment();
    var week;
    var firstDayWeek;
    var dates;
    var offset;
    var selectedTasks = {};

    /////////////////////
    // CONTROLLER

    this.init = function(){
      week = now.week();
      firstDayWeek = now.day(1);
      dates = [];
      for (i = 0; i < nbdays; i++){
        offset = Math.floor(i / dayPerWeek);
        offset = offset * (7-dayPerWeek);
        dates[i] = firstDayWeek.clone().add(i + offset,'d').format('YYYY-MM-DD');
      }
    }

    /////////////////////
    // LOAD DATA 

    this.getData = function(){

      var getJSON = $.getJSON( "data.php", function( data ) {

        tasks = [];

        $.each( data.users, function( key, data ) {
          users[data.id] = new user(data);
        });

        $.each( data.taskTypes, function( key, taskType ) {
          taskTypes[taskType.id] = taskType;
          taskTypesByDate[taskType.day] = taskType;
        });

        $.each( data.releases, function( key, release ) {
          releases[release.day] = release;
          releasesById[release.id] = release;
        });
        log("start");
        $.each( data.tasks, function( key, data ) {
          var t = new task(data);
          tasksById[t.id] = t;
          var key = t.id_user + ":" + t.day;
          if(tasks[key] != undefined ){
            tasks[key].push(t);
          }else{
            tasks[key] = new Array(t);
          }
        });
      });
      log(tasks);
      return getJSON;
    }

    /////////////////////
    // SYNCRONISE DATA 

    this.sync = function(){

      tasks = [];
      $.each( tasksById, function( key, task ) {
        if (task){
          var key = task.id_user + ":" + task.day;
          if(tasks[key] != undefined ){
            tasks[key].push(task);
          }else{
            tasks[key] = new Array(task);
          }
        }
      });

      releases = [];
      $.each( releasesById, function( key, release ) {
        if (release){
          var key =  release.day;
          releases[key] = release;
        }
      });
    }
    this.getUser = function (id){
      if(users[id] != undefined) {
        return users[id];
      }
    }
    /////////////////////
    // ADD TASK 

    this.addTask = function (task){
      tasksById[task.id] = task;
      this.init();
      this.sync();
      this.render();
      this.activate();
    }

    this.save = function(){
      $( "body" ).append('<div class="dataSaved"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>');
      $(".dataSaved").animate({opacity:1}).animate({opacity:0},400,function() {
        $(".dataSaved").remove();
      });
    }

    /////////////////////
    // DELETE TASK

    this.delSelectedTasks = function (){
      var removedTasksId = [];
      $.each(selectedTasks, function( key, task ) {
          delete tasksById[key];
          task.remove();
          delete selectedTasks[key];
          removedTasksId.push({"id":key,"id_user":"","title":"","id_type":"","day":""});
      });
      $.ajax({
        url: "data.php",
        dataType: "json",
        data: {
          a: "delTask",
          obj:JSON.stringify(removedTasksId)
        },
        success: function( task ) {
          log("taskRemoved");
        }
      });
    }

    /////////////////////
    // DISPLAY TASK  

    this.renderTask = function(key){
      var html = ''
      tabTask = tasks[key];
      if(tabTask){
        for (var i = 0; i < tabTask.length; i++){
          task = tabTask[i];
          color = taskTypes[task.id_type].color;
          html += '<li class="ui-state-default task ' + color + '" tid = "' + task.id + '" ><span>' + task.title + '</span></li>';
        }
      }
      return html;
    }

    /////////////////////
    // DISPLAY RELEASE    

    this.renderRelease = function(key){
      var html = ''
      release = releases[key];
      if(release){
        taskType = taskTypes[release.id_type];
        if(taskType){
          html += '<li class="ui-state-default release ' + taskType.color + '" tid = "' + release.id + '" ><span>';
          html += '<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> ';
          html +=  taskType.name + ' ' + release.name;
          html += ' <span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>';
          html +=  '</span></li>';
        }
      }
    return html;
    }

    /////////////////////
    // DISPLAY BOX    

    this.renderBox = function(type,idType){
      var html = ''
      html = '<div class="panel panel-default box">';
      html += '<div class="panel-heading">' + type + '</div>';
      html +=   '<div class="panel-body">';
      html +=     '<ul class="connectedSortable" di = "' + type + '" uid ="' + idType + '">' + this.renderTask(idType + ":0000-00-00") + '</ul>';
      html +=   '</div>';
      html += '</div>';
      return html;
    }

    /////////////////////
    // DISPLAY COMPONANT

    this.render = function(){
      var root = this;
      var html = "";

      // Week row
      html += '<tr class="week"><td class="firstCol"></td>';
      for (i = 0; i < nbWeekPerScreen; i++){
        html += '<td class="leftSep" colspan="' + dayPerWeek + '">W' + (i + week) + '</td>';
      }
      html += "</tr>";
    
      // Realeases row
      html += '<tr class="day"><td></td>';
      for (i = 0; i < nbdays; i++){
        var index = i % dayPerWeek;
        var css = ( index==0 ) ? 'leftSep' : '';
        html += '<td  class="' + css + '"><ul class="releaseSlot" di = "' + i + '">' + this.renderRelease(dates[i]) + '</ul></td>';
      }
      html += "</tr>";

      // Days row 
      html += '<tr class="day"><td></td>';
      for (i = 0; i < nbdays; i++){
        var index = i % dayPerWeek;
        var css = ( index==0 ) ? ' class="leftSep"' : '';
        html += '<td' + css + '>' + days[index] + '</td>';
      }
      html += "</tr>";

      // Rows tasks
      $.each( users, function( key, user ) {
        if(user){
          html += "<tr>";
          html += '<td class="firstCol" >' + user.firstname + '</td>';
          for (i = 0; i < nbdays; i++){
            var index = i % dayPerWeek;
            var css = ( index==0 ) ? ' class="leftSep"' : '';
            html += '<td' + css + '><ul class="connectedSortable" di = "' + i + '" uid ="'+ user.id +'">';
            html += root.renderTask(user.id + ":" + dates[i]);
            html += '</div></td>';
          }
          html += "</tr>";
        }
      });

      $("#tasksManager").html('<table class="table" width="100%" cellspacing="0">' + html + '</table>');
      $("#box").html(this.renderBox("DEV",1) +  this.renderBox("QA",2) + this.renderBox("PRD",3));
    }

    /////////////////////
    // JQUERY INITIALISATION

    this.activate = function(){

      // Task drag and drop
      $( ".connectedSortable" ).sortable({
        revert:150,
        cancel: ".disable-task",
        connectWith: ".connectedSortable",
        receive: function( event, ui ) {
          var task = tasksById[ui.item.attr("tid")];
          task.day = dates[$(this).attr("di")];
          task.id_user = $(this).attr("uid");
          $.ajax({
            url: "data.php",
            data: {
              a: "setData",
              obj:JSON.stringify(task)
            },
            success: function( data ) {
              log("saved");
            }
          });
        }
      }).disableSelection();

      // Task click
      $( ".connectedSortable > li" ).mousedown(function(e) {
        var id = $(this).attr("tid");
        var task =  tasksById[id];
        if(! task.isPpen){
          if(!e.ctrlKey){
            $.each(selectedTasks, function( key, task ) {
              task.removeClass('selected');
              delete selectedTasks[task.attr("tid")];
            });
          }
          selectedTask = $(this);
          selectedTask.addClass('selected');
          selectedTasks[selectedTask.attr("tid")] = selectedTask;
        }
      });

      // Task double click
      $( ".connectedSortable > li" ).dblclick(function() {
        var id = $(this).attr("tid");
        var task =  tasksById[id];
        $(this).removeClass('selected');
        if(! task.isOpen){
          task.open($(this));
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
          var task = tasksById[idTask];
          color = taskTypes[task.id_type].color;
          if(color == "pink"){
            return "";
          }
          return '<div class= "tooltip ' + color + '"><h1>' + element.text() + '</h1>' + task.desc + '</div>';
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
          var release = releasesById[ui.item.attr("tid")];
          release.day = dates[$(this).attr("di")];
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
    }

    /////////////////////
    // CHANGE WEEK

    this.changeInterval = function(nbWeek){
      log(now.format('MMMM Do YYYY'));
      now = now.add(nbWeek,'w');
      this.init();
      this.sync();
      this.render();
      this.activate();
    };
  }

  ////////////////////////////////////////////
  //
  //  EVENT MANAGEMEMENT
  //
  ////////////////////////////////////////////

  var tasksManager = new tasksManager();
  tasksManager.init();
  tasksManager.getData().done(function(){
    tasksManager.render();
    tasksManager.activate();
  });


  //////////////////////
  // Week navigation

   $( "#prev" ).click(function() {
    tasksManager.changeInterval(-1);
   });
   $( "#next" ).click(function() {
    tasksManager.changeInterval(1);
   });


  //////////////////////
  // Remove selected task

  $("#del_btn").click(function() {
    tasksManager.delSelectedTasks();
  });
  $('html').keydown(function(e){
      if(e.keyCode == 46){
        tasksManager.delSelectedTasks();
      }
  }) 


  //////////////////////
  // Add a new task

   $( "#addTask" ).click(function() {
    var title = $("#addTask-title").val();
    $.ajax({
      url: "data.php",
      dataType: "json",
      data: {
        a: "addTask",
        obj:JSON.stringify({"id":"", "id_user":"", "title":title, "id_type":"", "day":""})
      },
      success: function( task ) {
        tasksManager.addTask(task);
      }
    });
  }); 
});
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
      log(week)
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
        users = data.users;

        $.each( data.taskTypes, function( key, taskType ) {
          taskTypes[taskType.id] = taskType;
          taskTypesByDate[taskType.day] = taskType;
        });

        $.each( data.releases, function( key, release ) {
          releases[release.day] = release;
          releasesById[release.id] = release;
        });

        $.each( data.tasks, function( key, task ) {
          tasksById[task.id] = task;
          var key = task.id_user + ":" + task.day;
          if(tasks[key] != undefined ){
            tasks[key].push(task);
          }else{
            tasks[key] = new Array(task);
          }
        });
      });
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

    /////////////////////
    // ADD TASK 

    this.addTask = function (task){
      tasksById[task.id] = task;
      this.init();
      this.sync();
      this.render();
      this.activate();
    }

    /////////////////////
    // DELETE TASK

    this.delSelectedTasks = function (){
      var removedTasksId = [];
      $.each(selectedTasks, function( key, task ) {
          delete tasksById[key];
          task.remove();
          delete selectedTasks[key];
          removedTasksId.push(key);
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

    this.renderBox = function(type){
      var html = ''
      html = '<div class="panel panel-default box">';
      html += '<div class="panel-heading">' + type + '</div>';
      html +=   '<div class="panel-body">';
      html +=     '<ul class="connectedSortable" di = "' + type + '" uid ="0">' + this.renderTask("0:" + type) + '</ul>';
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
        html += "<tr>";
        html += '<td class="firstCol" >' + user.name + '</td>';
        for (i = 0; i < nbdays; i++){
          var index = i % dayPerWeek;
          var css = ( index==0 ) ? ' class="leftSep"' : '';
          html += '<td' + css + '><ul class="connectedSortable" di = "' + i + '" uid ="'+ user.id +'">';
          html += root.renderTask(user.id + ":" + dates[i]);
          html += '</div></td>';
        }
        html += "</tr>";
      });

      $("#tasksManager").html('<table class="table" width="100%" cellspacing="0">' + html + '</table>');
      $("#box").html(this.renderBox("DEV") +  this.renderBox("QA") + this.renderBox("PRD"));
    }

    /////////////////////
    // JQUERY INITIALISATION

    this.activate = function(){

      // Task drag and drop
      $( ".connectedSortable" ).sortable({
        revert:150,
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
        if(!e.ctrlKey){
          $.each(selectedTasks, function( key, task ) {
            task.removeClass('selected');
            delete selectedTasks[task.attr("tid")];
          });
        }
        selectedTask = $(this);
        selectedTask.addClass('selected');
        selectedTasks[selectedTask.attr("tid")] = selectedTask;
      });

      // Task double click
      $( ".connectedSortable > li" ).dblclick(function() {
        log("ok");
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

  //////////////////////
  // Event management

  var tasksManager = new tasksManager();

  tasksManager.getData().done(function(){
    tasksManager.init();
    tasksManager.getData();
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
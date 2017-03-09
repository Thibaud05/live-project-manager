'use strict'
var Task = require("./task.js");
var File = require("./file.js");
var Link = require("./link.js");
var Message = require("./message.js");
class TaskList
{
    constructor(){
      this.tasks = [];
      this.tasksById = [];
      this.files = {};
      this.links = {};
      this.messages = {};
      this.notifications = {};
      this.taskTypes = [];
      this.taskTypeByProject = [];
    }

    setData(data){
    	this.setFilesData(data.tasks_files)
    	this.setLinksData(data.tasks_links)
    	this.setMessagesData(data.tasks_messages)
      this.setNotificationsData(data.notification)
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

            if(self.notifications[t.id] != undefined ){
              t.notifications = self.notifications[t.id];
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
      this.taskTypeByProject = []
      data.map(function(taskType,key) {
        self.addType(taskType)
      });
    }

    addType(taskType){
        this.taskTypes[taskType.id] = taskType;
        var key = taskType.id_project
        if(this.taskTypeByProject[key]==undefined){
          this.taskTypeByProject[key] = []
        }
        this.taskTypeByProject[key].push(taskType);
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

    setNotificationsData(data){
      self = this
      data.map(function(data,key ) {
        if(data!=undefined){
          if(self.notifications[data.taskId] == undefined ){
            self.notifications[data.taskId] = [];
          }
          self.notifications[data.taskId].push(data);
        }
      });
    }


    getTasks(id,date){
      var key = ""
      if(date){
        key = id + ":" + date
      }else{
        key = id + ":0000-00-00"
      }
      var tabTask = this.tasks[key]
      if(!tabTask){
        tabTask = []
      }
      return tabTask
    }

    getPastTasks(){
      var pastTasks = []
      this.tasksById.map(function(t,key) {
        if(moment(t.day,'YYYY-MM-DD') < moment() && t.display && t.day != "0000-00-00"){
            pastTasks.unshift(t)
        }
      })
      return pastTasks
    }

    render(tasks,inBox){
      var html = ''
      if(tasks.length > 0){
        for (var i = 0; i < tasks.length; i++){
          var t = tasks[i];
          if(t){
             if(inBox){
              }
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
          var progressClass = "progressStatus hidden"
          var validClass = "ok hidden"
          var taskTitle = task.title
          var nbNotif = task.notifications.length
          if(!task.isLocked){
            var releaseName = window.tm.getLastRelease(task.typeId)
            if(task.typeId!=5 && task.typeId!=6 && releaseName){
               env = '<div class="env">' + releaseName + '</div>'
            }
            if(task.valid==1){
              validClass = "ok"
            }
            if(task.valid==2){
              progressClass = "progressStatus"
            }
            
            if(nbNotif > 0){
              taskTitle = '<span class="notif">' + nbNotif + '</span>' + taskTitle;
            }


          }else{
            color += " locked"
            taskTitle = window.tm.projectById[task.id_project].name
          }
          html = '<li class="ui-state-default task ' + color + '" tid = "' + task.id + '" >'+ env 
          + '<div class="contener"><span class="title">' + taskTitle + '</span>' 
          + '<div class="' + validClass + '"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>'
          + '<div class="' + progressClass + '"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div></div></li>';
        }
      return html
    }
	
}

module.exports=TaskList;


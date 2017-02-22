'use strict'
var ClientUser        = require('./../js/user.js');
class Store
{
    constructor()
    {
        this.sqls = [
          "SELECT * FROM `type`",
          "SELECT * FROM `release`",
          "SELECT * FROM `user`",
          "SELECT * FROM `task_file`",
          "SELECT * FROM `task`",
          "SELECT * FROM `project`",
          "SELECT * FROM `project_user`",
          "SELECT * FROM `task_link`",
          "SELECT * FROM `task_message`",
          "SELECT * FROM `box`"
        ]
        this.taskTypes      = []
        this.releases       = []
        this.users          = []
        this.tasks          = []
        this.tasks_files    = []
        this.tasks_links    = []
        this.tasks_messages = []
        this.projects       = []
        this.projects_user  = []
        this.box            = []
    }

    setData(data)
    {
        this.taskTypes      = data[0]
        this.releases       = this.indexById(data[1])
        this.users          = this.indexById(data[2])      
        this.tasks_files    = this.indexById(data[3])
        this.tasks          = this.indexById(data[4])
        this.projects       = this.indexById(data[5])
        this.projects_user  = data[6]
        this.tasks_links    = this.indexById(data[7])
        this.tasks_messages = this.indexById(data[8])
        this.box            = this.indexById(data[9])
        
    }

    getClientData(idUser)
    {
        var projects = []
        var tasks = []
        var tasks_links = []
        var types = []
        var typesId = {}
        var boxs = []
        var releases = []


        for (var project_user of this.projects_user){
            if(project_user.id_user == idUser){
                projects[project_user.id_project] = this.projects[project_user.id_project]
            }
        }

		//project filter
        for (var type of this.taskTypes){
            if(projects[type.id_project]){
                types.push(type)
                typesId[type.id] = true
            }
        }

        for (var boxId in this.box){
        	var box = this.box[boxId]
            if(projects[box.id_project]){
                boxs[box.id] = this.box[box.id]
            }
        }

		// type filter
        for (var taskId in this.tasks){
            var task = this.tasks[taskId]
            if(typesId[task.typeId]){
                tasks[taskId] = task
            }
        }

        for (var releaseId in this.releases){
            var release = this.releases[releaseId]
            if(typesId[release.typeId]){
                releases[releaseId] = release
            }
        }

        return {
            taskTypes       : types,
            releases        : releases,
            users           : this.getClientUsers(),
            tasks           : tasks,
            tasks_files     : this.getClientTaskData(tasks,this.tasks_files),
            tasks_links     : this.getClientTaskData(tasks,this.tasks_links),
            tasks_messages  : this.getClientTaskData(tasks,this.tasks_messages),
            projects        : projects,
            projects_user   : this.projects_user,
            box             : boxs
        }
    }

    getClientUsers()
    {
        var users = []
        for (var dataUser of this.users) {
            if(dataUser){
                var user = new ClientUser(dataUser)
                users.push(user)
            }
        }
        return users
    }

    getClientTaskData(tasks,data)
    {
    	var clientData = []
    	for (var id in data){
            var obj = data[id]
            if(tasks[obj.taskId]){
                clientData[id] = obj
            }
        }
        return clientData
    }


    getSql()
    {
        return this.sqls.join(";")
    }

    indexById(data)
    {
      var indexedData = []
      for (var obj of data){
        indexedData[obj.id] = obj
      }
      return indexedData
    }

}
module.exports = new Store();
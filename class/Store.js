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

    getClientData()
    {
        return {
            taskTypes       : this.taskTypes,
            releases        : this.releases,
            users           : this.getClientUsers(),
            tasks           : this.tasks,
            tasks_files     : this.tasks_files,
            tasks_links     : this.tasks_links,
            tasks_messages  : this.tasks_messages,
            projects        : this.projects,
            projects_user   : this.projects_user,
            box             : this.box
        }
    }

    getClientUsers(){
        var users = []
        for (var dataUser of this.users) {
            if(dataUser){
                var user = new ClientUser(dataUser)
                users.push(user)
            }
        }
        return users
    }



    getSql()
    {
        return this.sqls.join(";")
    }

    indexById(data)
    {
      var indexedData = []
      for (var i=0; i<data.length;i++){
        var obj = data[i]
        indexedData[obj.id] = obj
      }
      return indexedData
    }

}
module.exports = new Store();
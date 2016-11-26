'use strict'
class link
{
    constructor(data)
    {
        this.events = {};
        if(data)
        {
            this.id = data.id;
            this.title = data.title;
            this.taskId = data.taskId;
            this.link = data.url;
        }
    }

    add(){
        var sql = "INSERT INTO `task_link` (" +
                    "`title`, " +
                    "`taskId`, " +
                    "`link`" +
                ") VALUES (" +
                    "'" + this.title + "'," +
                    "'" + this.taskId + "'," +
                    "'" + this.link + "'" +
                ");"
        var self = this
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.data.tasks_links[self.id] = self
            self.dispatchEvent("added",self);
        });
    }
    del(){
        var sql = "DELETE FROM `task_link` WHERE id = " + this.id;
        global.connection.query(sql)
        delete global.data.tasks_links[this.id];
    }
    registerEvent(eventName)
    {
      var event = new Event(eventName)
      this.events[eventName] = event
    }

    dispatchEvent(eventName, eventArgs)
    {
      this.events[eventName].callbacks.forEach(function(callback){
        callback(eventArgs)
      })
    }

    addEventListener(eventName, callback){
      this.events[eventName].registerCallback(callback)
    };
}

class Event
{
    constructor(name){
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }
}

module.exports=link;


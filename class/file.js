'use strict'
class file
{
    constructor(data)
    {
        this.events = {};
        if(data)
        {
            this.id = data.id;
            this.title = data.title;
            this.taskId = data.taskId;
            this.type = data.type;
        }
    }

    add(){
        var sql = "INSERT INTO `task_file` (" +
                    "`title`, " +
                    "`taskId`, " +
                    "`type`" +
                ") VALUES (" +
                    "'" + this.title + "'," +
                    "'" + this.taskId + "'," +
                    "'" + this.type + "'" +
                ");"
        var self = this
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.data.tasks[self.id] = self
            self.dispatchEvent("added",self);
        });
    }
    del(){
        var sql = "DELETE FROM `task_file` WHERE id = " + this.id;
        global.connection.query(sql)
        delete global.data.tasks[this.id];
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

module.exports=file;


'use strict'
class message
{
    constructor(data)
    {
        this.events = {};
        if(data)
        {
            this.id = data.id;
            this.userId = data.userId;
            this.taskId = data.taskId;
            this.txt = data.txt;
            this.moment = global.moment().format("YYYY-MM-DD HH:mm:ss")
        }
    }

    add(){
        var sql = "INSERT INTO `task_message` (" +
                    "`userId`, " +
                    "`taskId`, " +
                    "`moment`, " +
                    "`txt`" +
                ") VALUES (" +
                    "'" + this.userId + "'," +
                    "'" + this.taskId + "'," +
                    "'" + this.moment + "'," +
                    "'" + this.txt + "'" +
                ");"
        var self = this
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.data.tasks_messages[self.id] = self
            self.dispatchEvent("added",self);
        });
    }
    del(){
        var sql = "DELETE FROM `task_message` WHERE id = " + this.id;
        global.connection.query(sql)
        delete global.data.tasks_messages[this.id];
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

module.exports=message;


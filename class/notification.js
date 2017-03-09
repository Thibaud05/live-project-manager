'use strict'
class notification
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.userId = data.userId;
            this.taskId = data.taskId;
            this.dateTime = global.moment().format("YYYY-MM-DD HH:mm:ss")
        }
    }

    save(){
        var sql = "INSERT INTO `notification` (" +
                    "`userId`, " +
                    "`taskId`, " +
                    "`dateTime` " +
                ") VALUES (" +
                    "'" + this.userId + "'," +
                    "'" + this.taskId + "'," +
                    "'" + this.dateTime + "'" +
                ");" 
        var self = this 
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.store.notification[self.id] = self
            self.onUpdateCompleted()
        })
    }

}
module.exports=notification;
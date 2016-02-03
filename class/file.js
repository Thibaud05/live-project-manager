'use strict'
class file
{
    constructor(data)
    {
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
    }
    global.connection.query(sql)

        var self = this

        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log(self)
            console.log(result.insertId);
            self.id = result.insertId;
            global.data.tasks[self.id] = self

            self.onUpdateCompleted()
        });
        /*
$( "#foo" ).on( "custom", function( event, param1, param2 ) {
  alert( param1 + "\n" + param2 );
});
$( "#foo").trigger( "custom", [ "Custom", "Event" ] );
        */
}
module.exports=file;
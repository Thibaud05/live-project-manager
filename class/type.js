'use strict'
class type
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.id_project = data.id_project;
            this.name = data.name;
            this.color = data.color;
        }
    }

    save(){
        var sql = "INSERT INTO `type` (" +
                    "`name`, " +
                    "`color`, " +
                    "`id_project` " +
                ") VALUES (" +
                    "'" + this.name + "'," +
                    "'" + this.color + "'," +
                    "'" + this.id_project + "'" +
                ");" 
        var self = this 
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.data.taskTypes.push(self);
            io.emit('addType',self);
        })
    }

}
module.exports=type;
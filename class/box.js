'use strict'
class box
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.id_project = data.id_project;
            this.name = data.name;
            this.order = data.order;
        }
    }

    save(){
        var sql = "INSERT INTO `box` (" +
                    "`name`, " +
                    "`order`, " +
                    "`id_project` " +
                ") VALUES (" +
                    "'" + this.name + "'," +
                    "'" + this.order + "'," +
                    "'" + this.id_project + "'" +
                ");" 
        var self = this 
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.store.box.push(self);
            io.emit('addBox',self);
        })
    }

}
module.exports=box;
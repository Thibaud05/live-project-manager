'use strict'
class release
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.name = data.name;
            this.typeId = data.typeId;
            this.day = data.day;
            this.id_project = data.id_project
        }
    }

    update(){
        var sql = "UPDATE `release` "
                + "SET `name` = '" + this.name + "',"
                    + "`typeId` = '" + this.typeId + "',"
                    + "`day` = '" + this.day + "'"
                + "WHERE `id` = '" + this.id + "'"
        global.connection.query(sql)
        global.data.releases[this.id] = this
    }

    save(){
        var sql = "INSERT INTO `release` (" +
            "`name`, " +
            "`typeId`, " +
            "`day` " +
        ") VALUES (" +
            "'" + this.name + "'," +
            "'" + this.typeId + "'," +
            "'" + this.day + "'" +
        ");"
        var self = this 
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            self.id = result.insertId;
            global.data.releases[self.id] = self
            console.log('addRelease' + self.name)
            io.emit('addRelease',self);
        })
    }

}
module.exports=release;
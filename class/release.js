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
        global.connection.query(sql, function(err, result) {
            if (err) throw err;
            this.id = result.insertId;
            global.data.releases[this.id] = this
            io.emit('addRelease',this);
        })
    }

}
module.exports=release;
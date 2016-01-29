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
    }
}
module.exports=release;
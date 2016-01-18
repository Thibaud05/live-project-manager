'use strict'
class release
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.name = data.name;
            this.id_type = data.id_type;
            this.day = data.day;
        }
    }

    update(){
        var sql = "UPDATE `release` "
                + "SET `name` = '" + this.name + "',"
                    + "`id_type` = '" + this.id_type + "',"
                    + "`day` = '" + this.day + "'"
                + "WHERE `id` = '" + this.id + "'"
        global.connection.query(sql)
    }
}
module.exports=release;
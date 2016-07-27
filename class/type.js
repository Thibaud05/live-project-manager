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

            var startDay = global.moment().startOf('week');
            var rAplha = new global.release({id:0,name:"α",typeId:self.id,day:startDay.add(1, 'd').format("YYYY-MM-DD")})
            var rDEV = new global.release({id:0,name:"DEV",typeId:self.id,day:startDay.add(1, 'd').format("YYYY-MM-DD")})
            var rQA = new global.release({id:0,name:"QA",typeId:self.id,day:startDay.add(1, 'd').format("YYYY-MM-DD")})
            var rPRD = new global.release({id:0,name:"PRD",typeId:self.id,day:startDay.add(1, 'd').format("YYYY-MM-DD")})
            rAplha.save()
            rDEV.save()
            rQA.save()
            rPRD.save()
        })
    }

}
module.exports=type;
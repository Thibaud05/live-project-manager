'use strict'

class task
{
    constructor(data)
    {
		this.id = data.id
		this.userId = data.userId
		this.title = data.title
		this.typeId = data.typeId
		this.day = data.day
		this.description = data.description
		this.creationUserId = data.creationUserId
		this.creationDate = data.creationDate
		this.accountableUserId = data.accountableUserId
		this.updateDate = global.moment().format("YYYY-MM-DD HH:mm:ss")
		this.priority = data.priority
		this.valid = data.valid
    }

    update()
    {
    	if(this.day== undefined){
			this.day = "0000-00-00";
		}
		var sql = "UPDATE `task` SET `title` = '" + global.escapeQuote(this.title) + "', " +
					"`userId` = '" + this.userId + "'," +
					"`creationUserId` = '" + this.creationUserId + "'," +
					"`accountableUserId` = '" + this.accountableUserId + "'," +
					"`typeId` = '" + this.typeId + "'," +
					"`day` = '" + this.day + "'," +
					"`updateDate` = '" + this.updateDate + "'," +
					"`creationDate` = '" + this.creationDate + "'," +
					"`priority` = '" + this.priority + "'," +
					"`valid` = '" + this.valid + "'," +
					"`description` = '" + global.escapeQuote(this.description) + "'" +
		 		" WHERE `id` = " + this.id
		console.log(sql)
		global.connection.query(sql)
		global.data.tasks[this.id] = this

		return this;
	}

	add()
	{
		if(this.day==""){
			this.day = date("Y-m-d");
		}
		if(this.creationDate==""){
			this.creationDate = global.moment().format("YYYY-MM-DD HH:mm:ss")
		}
		if(this.creationUserId == ""){
			this.creationUserId = this.accountableUserId;
		}
		if(this.userId == ""){
			this.userId = 1;
		}
		if(this.typeId == ""){
			this.typeId = 1;
		}
		var sql = "INSERT INTO `task` (" +
					"`title`, " +
					"`userId`, " +
					"`typeId`, " +
					"`day`, " +
					"`updateDate`, " +
					"`creationUserId`," +
					"`accountableUserId`," +
					"`creationDate`," +
					"`priority`," +
					"`valid`," +
					"`description`" +
				") VALUES (" +
					"'" + global.escapeQuote(this.title) + "'," +
					"'" + this.userId + "'," +
					"'" + this.typeId + "'," +
					"'" + this.day + "'," +
					"'" + this.updateDate + "'," +
					"'" + this.creationUserId + "'," +
					"'" + this.accountableUserId + "'," +
					"'" + this.creationDate + "'," +
					"'" + this.priority + "'," +
					"'" + this.valid + "'," +
					"'" + global.escapeQuote(this.description) + "'" +
				");"
		console.log(sql)
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
	}
	
	onUpdateCompleted()
	{
		console.log("onUpdateCompleted")
	}

	del()
	{
		var sql = "DELETE FROM `task` WHERE id = " + this.id;
		global.connection.query(sql)
		delete global.data.tasks[this.id];
	}
}
module.exports=task
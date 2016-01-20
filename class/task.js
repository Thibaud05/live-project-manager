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
		var sql = "UPDATE `task` SET `title` = '" + this.title + "', " +
					"`userId` = '" + this.userId + "'," +
					"`creationUserId` = '" + this.creationUserId + "'," +
					"`accountableUserId` = '" + this.accountableUserId + "'," +
					"`typeId` = '" + this.typeId + "'," +
					"`day` = '" + this.day + "'," +
					"`updateDate` = '" + this.updateDate + "'," +
					"`creationDate` = '" + this.creationDate + "'," +
					"`priority` = '" + this.priority + "'," +
					"`valid` = '" + this.valid + "'," +
					"`description` = '" + this.description + "'" +
		 		" WHERE `id` = " + this.id
		console.log(sql)
		global.connection.query(sql)
		global.data.tasks[this.id] = this
		//global.json.tasks
		//res = mysqli->query($sql);
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
					"`idType`, " +
					"`day`, " +
					"`updateDate`, " +
					"`creationUserId`," +
					"`accountableUserId`," +
					"`creationDate`," +
					"`priority`," +
					"`valid`," +
					"`description`" +
				") VALUES (" +
					"'" + this.title + "'," +
					"'" + this.userId + "'," +
					"'" + this.idType + "'," +
					"'" + this.day + "'," +
					"'" + this.updateDate + "'," +
					"'" + this.creationUserId + "'," +
					"'" + this.accountableUserId + "'," +
					"'" + this.creationDate + "'," +
					"'" + this.priority + "'," +
					"'" + this.valid + "'," +
					"'" + this.description + "'" +
				");"
		//$res = SQL::$mysqli->query($sql);

		//$this->id = SQL::$mysqli->insert_id;
		return this;
	}

	del()
	{
		var sql = "DELETE FROM `task` WHERE id = " + this.id;
		//$res = SQL::$mysqli->query($sql);
	}
}
module.exports=task
'use strict'

class task
{
    constructor(data)
    {
		this.id = data.id
		this.id_user = data.id_user
		this.title = data.title
		this.id_type = data.id_type
		this.day = data.day
		this.description = data.description
		this.creationUser = data.creationUser
		this.creationDate = data.creationDate
		this.accountableUser = data.accountableUser
		this.updateDate = date("Y-m-d H:i:s")
		this.priority = data.priority
		this.valid = data.valid
    }

    update(){
		var sql = "UPDATE `task` SET `name` = '" + this.title + "', " +
					"`id_user_responsible` = '" + this.id_user + "'," +
					"`id_user_add` = '" + this.creationUser + "'," +
					"`id_user_accountable` = '" + this.accountableUser + "'," +
					"`id_type` = '" + this.id_type + "'," +
					"`date_finish` = '" + this.day + "'," +
					"`date_update` = '" + this.updateDate + "'," +
					"`date_creation` = '" + this.creationDate + "'," +
					"`priority` = '" + this.priority + "'," +
					"`valid` = '" + this.valid + "'," +
					"`comments` = '" + this.description + "'" +
		 		"WHERE `id` = " + this.id
		//res = mysqli->query($sql);
		return this;
	}

	add()
	{
		if(this.day==""){
			this.day = date("Y-m-d");
		}
		if(this.creationDate==""){
			this.creationDate = date("Y-m-d H:i:s");
		}
		if(this.creationUser == ""){
			this.creationUser = this.accountableUser;
		}
		if(this.id_user == ""){
			this.id_user = 1;
		}
		if(this.id_type == ""){
			this.id_type = 1;
		}
		var sql = "INSERT INTO `task` (" +
					"`name`, " +
					"`id_user_responsible`, " +
					"`id_type`, " +
					"`date_finish`, " +
					"`date_update`, " +
					"`id_user_add`," +
					"`id_user_accountable`," +
					"`date_creation`," +
					"`priority`," +
					"`valid`," +
					"`comments`" +
				") VALUES (" +
					"'" + this.title + "'," +
					"'" + this.id_user + "'," +
					"'" + this.id_type + "'," +
					"'" + this.day + "'," +
					"'" + this.updateDate + "'," +
					"'" + this.creationUser + "'," +
					"'" + this.accountableUser + "'," +
					"'" + this.creationDate + "'," +
					"'" + this.priority + "'," +
					"'" + this.valid + "'," +
					"'" + this.description + "'" +
				)";" +
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
module.exports=app
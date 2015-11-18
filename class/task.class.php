<?php
/**
 * User: TGRA
 * Date: 23/06/15
 * Time: 09:23
 */

class task {

	var $id;
	var $id_user;
	var $title;
	var $id_type;
	var $day;
	var $description;
	var $creationUser;
	var $creationDate;
	var $updateDate;
	var $priority;
	var $accountableUser;

	function task ($obj){
		$this->id = $obj->id;
		$this->id_user = $obj->id_user;
		$this->title = SQL::$mysqli->real_escape_string($obj->title);
		$this->id_type = $obj->id_type;
		$this->day = $obj->day;
		$this->description = SQL::$mysqli->real_escape_string($obj->description);
		$this->creationUser = $obj->creationUser;
		$this->creationDate = $obj->creationDate;
		$this->accountableUser = $obj->accountableUser;
		$this->updateDate = date("Y-m-d H:i:s");
		$this->priority = $obj->priority;
	}
	function update(){
		$sql = "UPDATE `task` 
				SET `name` = '".$this->title."',
					`id_user_responsible` = '".$this->id_user."',
					`id_user_add` = '".$this->creationUser."',
					`id_user_accountable` = '".$this->accountableUser."',
					`id_type` = '".$this->id_type."',
					`date_finish` = '".$this->day."',
					`date_update` = '".$this->updateDate."',
					`date_creation` = '".$this->creationDate."',
					`priority` = '".$this->priority."',
					`comments` = '".$this->description."'
		 		WHERE `id` = ".$this->id;
		$res = SQL::$mysqli->query($sql);

	}
	function add(){
		if($this->day==""){
			$this->day = date("Y-m-d");
		}
		if($this->creationDate==""){
			$this->creationDate = date("Y-m-d H:i:s");
		}
		if($this->creationUser == ""){
			$this->creationUser = $this->accountableUser;
		}
		if($this->id_user == ""){
			$this->id_user = 1;
		}
		if($this->id_type == ""){
			$this->id_type = 1;
		}
		$sql = "INSERT INTO `task` (
					`name`, 
					`id_user_responsible`, 
					`id_type`, 
					`date_finish`, 
					`date_update`, 
					`id_user_add`,
					`id_user_accountable`,
					`date_creation`,
					`priority`,
					`comments`
				) VALUES (
					'".$this->title."',
					'".$this->id_user ."',
					'".$this->id_type ."',
					'".$this->day."',
					'".$this->updateDate."',
					'".$this->creationUser."',
					'".$this->accountableUser."',
					'".$this->creationDate."',
					'".$this->priority."',
					'".$this->description."'
				)";
		$res = SQL::$mysqli->query($sql);

		$this->id = SQL::$mysqli->insert_id;
		return $this;
	}
	function del(){
		$sql = "DELETE FROM `task` WHERE id = ".$this->id;
		$res = SQL::$mysqli->query($sql);
	}
}
?>
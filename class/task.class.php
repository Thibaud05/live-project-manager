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

	function task ($obj){
		$this->id = $obj->id;
		$this->id_user = $obj->id_user;
		$this->title = SQL::$mysqli->real_escape_string($obj->title);
		$this->id_type = $obj->id_type;
		$this->day = $obj->day;
		$this->description = SQL::$mysqli->real_escape_string($obj->description);
		$this->creationUser = $obj->creationUser;
		$this->creationDate = date("Y-m-d H:i:s");
	}
	function update(){
		$sql = "UPDATE `task` 
				SET `name` = '".$this->title."',
					`id_user_responsible` = '".$this->id_user."',
					`id_user_add` = '".$this->creationUser."',
					`id_type` = '".$this->id_type."',
					`date_finish` = '".$this->day."',
					`date_creation` = '".$this->creationDate."',
					`comments` = '".$this->description."'
		 		WHERE `id` = ".$this->id;
		$res = SQL::$mysqli->query($sql);

	}
	function add(){
		if($this->day==""){
			$this->day = date("Y-m-d");
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
					`id_user_add`,
					`date_creation`,
					`comments`
				) VALUES (
					'".$this->title."',
					'".$this->id_user ."',
					'".$this->id_type ."',
					'".$this->day."',
					'".$this->creationUser."',
					'".$this->creationDate."',
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
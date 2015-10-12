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

	function task ($obj){
		$this->id = $obj->id;
		$this->id_user = $obj->id_user;
		$this->title = $obj->title;
		$this->id_type = $obj->id_type;
		$this->day = $obj->day;
		$this->description = $obj->description;
		$this->creationUser = $obj->creationUser;
	}
	function update(){
		$sql = "UPDATE `task` 
				SET `name` = '".$this->title."',
					`id_user_responsible` = '".$this->id_user."',
					`id_user_add` = '".$this->creationUser."',
					
					`id_type` = '".$this->id_type."',
					`date_finish` = '".$this->day."',
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
					`comments`
				) VALUES (
					'".$this->title."',
					'".$this->id_user ."',
					'".$this->id_type ."',
					'".$this->day."',
					'".$this->description."'
				)";
		$res = SQL::$mysqli->query($sql);
		$this->id = SQL::$mysqli->insert_id;
		echo json_encode($this);
	}
	function del(){
		$sql = "DELETE FROM `task` WHERE id = ".$this->id;
		$res = SQL::$mysqli->query($sql);
	}
}
?>
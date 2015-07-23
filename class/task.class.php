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

	function task ($obj){
		$this->id = $obj->id;
		$this->id_user = $obj->id_user;
		$this->title = $obj->title;
		$this->id_type = $obj->id_type;
		$this->day = $obj->day;
	}
	function update(){
		$sql = "UPDATE `task` 
				SET `name` = '".$this->title."',
					`id_user_responsible` = '".$this->id_user."',
					`id_type` = '".$this->id_type."',
					`date_finish` = '".$this->day."'
		 		WHERE `id` = ".$this->id;
		$res = SQL::$mysqli->query($sql);

	}
	function add(){
		$this->day = date("Y-m-d");
		$this->id_user = 1;
		$this->id_type = 1;
		$sql = "INSERT INTO `task` (`name`, `id_user_responsible`, `id_type`, `date_finish`) VALUES ('".$this->title."','".$this->id_user ."','".$this->id_type ."','".$this->day."')";
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
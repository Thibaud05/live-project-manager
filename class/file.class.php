<?php
/**
 * User: TGRA
 * Date: 05/08/15
 * Time: 16:14
 */

class file {

	var $id;
	var $id_task;
	var $title;
	var $type;

	function file ($obj){
		$this->id = $obj->id;
		$this->title = $obj->name;
		$this->type = $obj->type;
	}
	function add(){
		$sql = "INSERT INTO `task_file` (
					`id_task`, 
					`title`, 
					`type`
				) VALUES (
					'".$this->id_task."',
					'".$this->title ."',
					'".$this->type."'
				)";
		$res = SQL::$mysqli->query($sql);
		$this->id = SQL::$mysqli->insert_id;
		return $this;
	}
	function del(){
		$sql = "DELETE FROM `task_file` WHERE id = ".$this->id;
		$res = SQL::$mysqli->query($sql);
		unlink ("server/files//".$this->title);
		unlink ("server/files/thumbnail/".$this->title);
		//echo json_encode((object)array("reponse"=>"true")));
	}
}
?>
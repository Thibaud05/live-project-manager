<?php
/**
 * User: TGRA
 * Date: 30/06/15
 * Time: 07:34
 */

class release {

	var $id;
	var $name;
	var $id_type;
	var $day;

	function release ($obj){
		$this->id = $obj->id;
		$this->name = $obj->name;
		$this->id_type = $obj->id_type;
		$this->day = $obj->day;
	}
	function update(){
		$sql = "UPDATE `release` 
				SET `name` = '".$this->name."',
					`id_type` = '".$this->id_type."',
					`day` = '".$this->day."'
		 		WHERE `id` = ".$this->id;
		 echo $sql;
		$res = SQL::$mysqli->query($sql);

	}
}
?>
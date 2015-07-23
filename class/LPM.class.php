<?php

require_once 'class/SQL.class.php';
require_once 'class/task.class.php';
require_once 'class/release.class.php';
/**
 * User: TGRA
 * Date: 23/06/15
 * Time: 09:23
 */

class LPM {
	var $action;
	function LPM (){
		$this->controller();
	}
	function controller(){
		if(isset($_GET["a"])){
			$this->action = $_GET["a"];
			switch ($this->action) {
				case 'setData':

					$this->setData();
					break;
				case 'addTask':

					$this->addTask();
					break;

				case 'setRelease':

					$this->setRelease();
					break;
				
				default:
					# code...
					break;
			}
		}
	}
	function setData(){
		$obj = json_decode($_GET["obj"]);
		$task = new task($obj);
		$task->update();
		exit;
	}
	function setRelease(){
		$obj = json_decode($_GET["obj"]);
		$release = new release($obj);
		$release->update();
		exit;
	}
	function addTask(){
		$obj = json_decode($_GET["obj"]);
		$task = new task($obj);
		$task->add();
		exit;
	}
}
?>
<?php

require_once 'class/SQL.class.php';
require_once 'class/task.class.php';
require_once 'class/release.class.php';
require_once 'class/file.class.php';
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
			$obj = json_decode($_GET["obj"]);
			switch ($this->action) {
				case 'setData':

					$this->setData($obj);
					break;
				case 'updateTask':

					$this->updateTask($obj);
					break;
				case 'moveTask':

					$this->moveTask($obj);
					break;
				case 'setDataFiles':

					$this->setDataFiles($obj);
					break;
				case 'delDataFiles':

					$this->delDataFiles($obj);
					break;
				case 'addTask':

					$this->addTask($obj);
					break;

				case 'setRelease':

					$this->setRelease($obj);
					break;

				case 'delTask':

					$this->delTask($obj);
					break;
						
				case 'duplicateTask':

					$this->duplicateTask($obj);
					break;
				default:
					# code...
					break;
			}
		}
	}
	function setData($obj){
		$task = new task($obj);
		$task->update();
		exit;
	}
	function setRelease($obj){
		$release = new release($obj);
		$release->update();
		exit;
	}
	function addTask($obj){
		$task = new task($obj);
		echo json_encode($task->add());
		exit;
	}
	function delTask($objs){
		foreach ($objs as $obj) {
			$task = new task($obj);
			$task->del();
		}
		exit;
	}
	function moveTask($objs){
		foreach ($objs as $obj) {
			$task = new task($obj);
			$task->update();
		}
		exit;
	}
	function duplicateTask($objs){
		$arr = [];
		foreach ($objs as $obj) {
			$task = new task($obj);
			$arr[] = $task->add();
		}
		echo json_encode($arr);
		exit;
	}
	function setDataFiles($obj){
		$data = $obj->files[0];
		$data->id = "";
		$file = new file($data);
		$file->id_task = $obj->taskId;
		echo json_encode($file->add());
		exit;
	}
	function updateTask($objs){
		$arr = [];
		foreach ($objs as $obj) {
			$task = new task($obj);
			$arr[] = $task->update();
		}
		echo json_encode($arr);
		exit;
	}
	function delDataFiles($obj){
		$file = new file($obj);
		$file->del();
		exit;
	}
}
?>
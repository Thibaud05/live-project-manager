<?php
/**
 * User: TGRA
 * Date: 14/10/15
 * Time: 08:26
 */

class report {

	var $now;
	var $releases;
	var $tasks;

	function report (){
		$this->html = "";
		$this->now = new DateTime;
		$this->nowSql = $this->now->format("Y-m-d");
		$this->releases = [];
		$this->tasks = [];
		$this->getRelease();
		$this->getTask();
	}
	function getTask(){
		$sql = "SELECT date_finish,id_type FROM `task` WHERE `date_finish` > '".$this->nowSql."'";
		$res = SQL::$mysqli->query($sql);
		while ($task = $res->fetch_object()) {
			$day = (new DateTime($task->date_finish))->format("Y-m-d");
		    $this->tasks[$day] = $task->id_type;
		}
	}
	function getRelease(){
		$sql = "SELECT * FROM `release` WHERE `day` > '".$this->nowSql."'";
		$res = SQL::$mysqli->query($sql);
		while ($release = $res->fetch_object()) {
			$day = (new DateTime($release->day))->format("W");
		    $this->releases[$day] = $release->id_type;
		}
	}
	function display(){
		$html = '<tr class="day"><td></td>';
		for($i=0; $i<24 ;$i++){
			$week = $this->now->format('W');
		    $html .= '<td>'.$week;
		    $class = "";
		    if(isset($this->releases[$week])){$class="blue";}	
			$html .= "<div style='height:20px' class='".$class."'></div>";
		    $html .= '<table width="100%"><tr>';
		    for($j=0;$j<5;$j++){
		    	$key = $this->now->format('Y-m-d');

		    	$class = "";
		    	if(isset($this->tasks[$key])){$class="teal";}

		    	$html .= "<td height='10px' class='".$class."'></td>";
		    	$this->now->modify( '+1 day' );
		    }
		    $html .= '</tr></table></td>';
		    $this->now->modify( '+2 day' );
		}
		$html .= '</tr>'; 
		echo '<div id="report"><table class="table" width="100%" cellspacing="0">'.$html.'</table></div>';
	}
}
?>

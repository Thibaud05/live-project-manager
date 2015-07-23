<?php
/**
 * User: TGRA
 * Date: 23/06/15
 * Time: 09:23
 */
class sqlToJson {

	var $sqlList;

	function sqlToJson (){
		$sqlList = array();
	}

	function addSql($store,$sql){
		$this->sqlList[$store] = $sql;
	}

	function get(){
		$json = "";
		foreach ($this->sqlList as $store => $sql) {
			$json .= ($json == "") ? "" : ",";
			$json .= $this->getStoreJson($store,$sql);
		}
		echo "{".$json."}";
	}

	function getStoreJson($store,$sql){
		$json = "";
		$res = SQL::$mysqli->query($sql);
		if($res){
			$fields = $res->fetch_fields();
			while ($row = $res->fetch_assoc()) {
				$objArray = array();
				foreach ($fields as $val) {
					$objArray[$val->name] = $row[$val->name];
				}
				$json .= ($json == "") ? "" : ",";
				$json .= json_encode((object) $objArray);
			}
		}
		return '"'.$store.'":['.$json.']';
	}
}
?>
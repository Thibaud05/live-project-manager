<?php
/**
 * Created by PhpStorm.
 * User: kazz
 * Date: 05/02/14
 * Time: 09:23
 */
class SQL {
    public static $mysqli;

    public static function connect() {
        self::$mysqli = new mysqli("127.0.0.1", "root", "", "ltm");
        
        if (self::$mysqli->connect_error) {
            die('Erreur de connexion (' . self::$mysqli->connect_errno . ') '
                    . self::$mysqli->connect_error);
        }
        
        self::$mysqli->set_charset("utf8");

    }

    public static function ToSQLDate(DateTime $date){
        return $date->format('Y-m-d');
    }

    public static function FreeResults(){
        $db = self::$mysqli;
        do {
            if ($res = $db->store_result()) {
                $res->free();
            }
        } while ($db->more_results() && $db->next_result());
    }

    public static function SelectValues($query){
        $values = array();

        if ($result = self::$mysqli->query($query)) {
            $row = $result->fetch_row();

            if($row)
                $values = $row;
        }

        return $values;
    }

//    public static function GroupBy(array $key, array $value, $table, $where){
//        $sql = "SELECT ".implode(", ", array_merge($key, $value))." FROM ".$table." WHERE ".$where." ORDER BY ".implode(", ", $key);
//        $array = array();
//
//        if($result = self::$mysqli->query($sql)){
//            $currentKey = array();
//            while($arr = $result->fetch_array()){
//                foreach ($arr as $k => $v) {
//                    if(in_array($k, $key))
//                    $currentKey[]
//                }
//
//            }
//        }
//    }
} 
<?php
require_once 'class/SQL.class.php';
require_once 'class/LPM.class.php';
require_once 'class/sqlToJson.class.php';

SQL::connect();

$LPM = new LPM();
$json = new sqlToJson();

$json->addSql("tasks","SELECT id,id_user_responsible as id_user,name as title,id_type,date_finish as day, comments as description FROM task");
$json->addSql("taskTypes","SELECT * FROM type");
$json->addSql("releases","SELECT * FROM `release`");
$json->addSql("users","SELECT id,firstname, lastname FROM user");

$json->get();

?>
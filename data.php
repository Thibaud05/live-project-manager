<?php
include("class/template.php");
$page = new template("3");

require_once 'class/LPM.class.php';
require_once 'class/sqlToJson.class.php';

$LPM = new LPM();
$json = new sqlToJson();

$json->addSql("tasks","SELECT id,id_user_responsible as id_user,name as title,id_type,date_finish as day, comments as description , id_user_add as creationUser, date_creation as creationDate, priority FROM task ORDER BY priority");
$json->addSql("taskTypes","SELECT * FROM type");
$json->addSql("releases","SELECT * FROM `release`");
$json->addSql("users","SELECT id,firstname, lastname,id_group as level FROM user");
$json->addSql("tasks_files","SELECT * FROM task_file");
$json->addVar("connectUserId",$page->login->id);
$json->addVar("fullUrl",get_full_url());
$json->get();




function get_full_url() {
    $https = !empty($_SERVER['HTTPS']) && strcasecmp($_SERVER['HTTPS'], 'on') === 0 ||
        !empty($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
            strcasecmp($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') === 0;
    return
        ($https ? 'https://' : 'http://').
        (!empty($_SERVER['REMOTE_USER']) ? $_SERVER['REMOTE_USER'].'@' : '').
        (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : ($_SERVER['SERVER_NAME'].
        ($https && $_SERVER['SERVER_PORT'] === 443 ||
        $_SERVER['SERVER_PORT'] === 80 ? '' : ':'.$_SERVER['SERVER_PORT']))).
        substr($_SERVER['SCRIPT_NAME'],0, strrpos($_SERVER['SCRIPT_NAME'], '/'));
}
?>
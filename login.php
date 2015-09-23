<?php
session_start();
require_once 'class/SQL.class.php';
require_once 'class/login.class.php';

SQL::connect();

$login = new login();
if(isset($_GET["changePassword"])){
    $login->check(true);
    $login->changePassword();
}else{
    $login->connect();
}
$login->result();
?>
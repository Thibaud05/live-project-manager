<?php
session_start();
require_once 'class/SQL.class.php';
require_once 'class/login.class.php';

SQL::connect();

$login = new login();
$login->connect();
$login->result();
?>
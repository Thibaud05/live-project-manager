<?php
/**
 * User: TGRA
 * Date: 06/07/15
 * Time: 07:30
 */
class login {
    var $id;
    var $name;
    var $email;
    var $password;
    var $logged;

    function login()
    {
        if(isset($_SESSION['login'])){
            $obj = unserialize($_SESSION['login']);
            $this->name = $obj->name;
            $this->logged = $obj->logged;
        }
    }

    function connect()
    {
        $this->logged = false;
        if(isset($_POST['email']) && isset($_POST['password']))
        {
            $this->email = $_POST['email'];
            $this->password = $_POST['password'];
            $query = "SELECT `id`,`email`,`password`,`firstname` FROM `user`WHERE `email` = '".$this->email."' AND `password` ='".$this->password."'";
            if ($result = SQL::$mysqli->query($query))
            {
                while ($obj = $result->fetch_object()) 
                {

                    $this->name = $obj->firstname;
                    $this->saveLogin();
                    $this->logged = true;
                }
            $result->free();
            }
        }
    }

    function saveLogin()
    {
        $_SESSION['login'] = serialize($this);
    }
    function result()
    {
        echo '{"logged":"' . $this->logged . '"}';
    }
    function check(){
        if(!isset($_SESSION['login'])){
            header('Location: index.php'); 
            exit();
        }
    }
} 
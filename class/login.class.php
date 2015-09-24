<?php
/**
 * User: TGRA
 * Date: 06/07/15
 * Time: 07:30
 */
class login {
    var $id;
    var $name;
    var $lastname;
    var $email;
    var $password;
    var $logged;

    function login()
    {
        if(isset($_SESSION['login'])){
            $obj = unserialize($_SESSION['login']);
            $this->name = $obj->name;
            $this->lastname = $obj->lastname;
            $this->logged = $obj->logged;
            $this->id = $obj->id;
            $this->email = $obj->email;
            $this->password = $obj->password;
        }
        if(isset($_GET['logout'])){
            session_destroy();
            header('Location: index.php');
            exit();
        }
    }

    function connect()
    {
        $this->logged = false;
        if(isset($_POST['email']) && isset($_POST['password']))
        {
            $this->email = $_POST['email'];
            $this->password = $_POST['password'];
            $query = "SELECT `id`,`email`,`password`,`firstname`,`lastname` FROM `user`WHERE `email` = '".$this->email."' AND `password` ='".$this->password."'";
            if ($result = SQL::$mysqli->query($query))
            {
                while ($obj = $result->fetch_object()) 
                {

                    $this->id = $obj->id;
                    $this->name = $obj->firstname;
                    $this->lastname = $obj->lastname;
                    $this->save();
                    $this->logged = true;
                }
            $result->free();
            }
        }
    }

    function save()
    {
        $_SESSION['login'] = serialize($this);
    }
    function result()
    {
        echo '{"logged":"' . $this->logged . '"}';
    }
    function check($init = false){
        //print_r($this);
        if(!isset($_SESSION['login'])){
            header('Location: index.php'); 
            exit();
        }
        if(($this->password=="0000")&&(!$init)){
            header('Location: password.php');
            exit();
        }
    }
    function getUserName(){
        return ucfirst($this->name) . " " . strtoupper($this->lastname);
    }
    function changePassword(){
        $password = $_POST['password'];
        $password2 = $_POST['password2'];
        $this->logged = false;
        if($password==$password2 && $password != "0000"){
            $this->logged = true;
            $this->password = $password;
            $this->save();
            $query = "UPDATE `user` SET  `password` =  '".$password."' WHERE `id` =".$this->id;
            SQL::$mysqli->query($query);
        }
       
    }
} 
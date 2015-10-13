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
    var $autoconnexion;
    var $logged;
    var $salt;

    function login()
    {
        $this->salt = "'*ùµ$#";
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
            setcookie("LPMlogin","",time()-1);
            session_destroy();
            header('Location: index.php');
            exit();
        }
    }

    function connect()
    {
        $this->logged = false;
        $query = "";
        $autoConnect = isset($_COOKIE['LPMlogin']) && !isset($_POST['password']);
        if((isset($_POST['email']) && isset($_POST['password']))){
            $this->email = $_POST['email'];
            $this->password = $_POST['password'];
            $query = "SELECT `id`,`email`,`password`,`firstname`,`lastname`,`autoconnexion` FROM `user`WHERE `email` = '".$this->email."' AND `password` ='".$this->password."'";    
        }else if ($autoConnect){
            $query = "SELECT `id`,`email`,`password`,`firstname`,`lastname`,`autoconnexion` FROM `user`WHERE `autoconnexion` = '".md5($_COOKIE['LPMlogin'])."'";
        }
        
        if ($query !="" && $result = SQL::$mysqli->query($query))
        {
            while ($obj = $result->fetch_object()) 
            {

                $this->id = $obj->id;
                $this->name = $obj->firstname;
                $this->lastname = $obj->lastname;
                $this->autoconnexion = $obj->autoconnexion;
                $this->save();
                $this->logged = true;
                if ($autoConnect){
                    header('Location: home.php'); 
                }
            }
        $result->free();
        }
    }

    function autoConnect(){

    }

    function save()
    {
        $key = md5($this->email.$this->salt.$this->password);
        if($this->autoconnexion != $key){
            SQL::$mysqli->query('UPDATE `user` SET `autoconnexion` = "'.md5($key).'" WHERE `id` = "'.$this->id.'"');
        }
        $_SESSION['login'] = serialize($this);
        setcookie("LPMlogin",$key,time()+(365*24*3600));
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
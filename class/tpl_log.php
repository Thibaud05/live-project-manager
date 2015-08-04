<?php
session_start();
require_once 'class/page.php';
require_once 'class/SQL.class.php';
require_once 'class/login.class.php';
class tpl_log extends page {

    public function __construct($id){
        $this->id = $id;
        $this->title = "Titre par default";
        $this->site_title = "Mon site";
        $this->sep = " - ";
        $this->desc = "Description par default";
        $this->tag = "Mots clef par default";
        $this->addCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css");
        $this->addCss("http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css");
        $this->addJs("https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
        $this->addJs("http://code.jquery.com/ui/1.11.4/jquery-ui.js");
        $this->addJs("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js");
        $this->addJs("js/moment.min.js");
        $this->addCss('http://fonts.googleapis.com/css?family=Roboto:400,300');
        SQL::connect();
    }
    protected function header(){
        return '';
    }
    protected function footer(){
        return '';
    }
}
?>




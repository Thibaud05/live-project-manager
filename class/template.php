<?php
session_start();
require_once 'class/page.php';
require_once 'class/SQL.class.php';
require_once 'class/login.class.php';
class template extends page {
    var $login;

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
        $this->login = new login();
        $this->login->check();
    }
    protected function header(){
        return '<div class="stripHead"></div>
                <div class="head">
                <div class="LPMrond"><span>LPM</span></div>
                    <ul class="nav navbar-right" role="tablist">
                      <li role="presentation" class="dropdown">
                        <a id="user" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                          '.$this->login->getUserName().'
                          <span class="caret"></span>
                        </a>
                        <ul id="menu3" class="dropdown-menu" aria-labelledby="user">
                          <li><a href="#">Mon compte</a></li>
                          <li role="separator" class="divider"></li>
                          <li><a href="?logout">Déconnexion</a></li>
                        </ul>
                      </li>
                    </ul>
                <div class="clear"></div>
                </div>
                <div class="strip"></div>';
    }
    protected function footer(){
        return '';
    }
}
?>



<?php
include("class/tpl_log.php");
$page = new tpl_log("1");
$login = new login();
$login->connect();
$page->title = "Live project manager";
$page->addCss("css/login.css");
$page->addJs("js/login.js");
$page->displayHeader();
?>
<div class="container">
	<div class="form-signin">
		<div class="LPMrond"><span>LPM</span></div>
		<form id="form-signin" method="POST" action="login.php" >
	        <label for="inputEmail" class="sr-only">Email address</label>
	        <input name="email" type="email" id="inputEmail" class="form-control" placeholder="Votre@e-mail.fr" required="" autofocus="">
	        <label for="inputPassword" class="sr-only">Password</label>
	        <input name="password" type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" required="">
	        <br>
		  	<button type="submit" id="btn-submit" class="btn btn-lg btn-default btn-block">Connexion</button>
		</form>
	</div>
</div>
<?php
$page->displayFooter();

?>
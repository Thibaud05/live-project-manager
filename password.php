<?php
include("class/tpl_log.php");
$page = new tpl_log("1");

$page->title = "Live project manager";
$page->addCss("css/login.css");
$page->addJs("js/login.js");
$page->displayHeader();
?>
<div class="container">
	<div class="form-signin">
		<div class="LPMrond"><span>LPM</span></div>
		<h1>Première connexion</h1>
		<form id="form-signin" method="POST" action="login.php?changePassword" >
	        <label for="inputPassword" class="sr-only">Email address</label>
	        <input name="password" type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" required="" autofocus="">
	        <label for="inputPassword2" class="sr-only">Password</label>
	        <input name="password2" type="password" id="inputPassword2" class="form-control" placeholder="Confirmation du mot de passe" required="">
	        <br>
		  	<button type="submit" id="btn-submit" class="btn btn-lg btn-default btn-block">Modifier</button>
		</form>
	</div>
</div>
<?php
$page->displayFooter();
?>
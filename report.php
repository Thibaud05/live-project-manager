<?php
include("class/template.php");
include("class/report.class.php");
$page = new template("3");
$page->title = "Live project manager";
$page->addCss("css/app.css");
$page->addJs("js/app.js");

$page->addJs("js/upload/jquery.iframe-transport.js");
$page->addJs("js/upload/jquery.fileupload.js");
$page->addCss("css/jquery.fileupload.css");

$page->displayHeader();

$report = new report();
echo '<div class="container">'.$report->display().'</div>';

$page->displayFooter();
?>
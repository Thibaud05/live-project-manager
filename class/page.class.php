<?php
class page {

	var $id;
	var $title;
	var $site_title;
	var $sep;
	var $desc;
	var $tag;
	var $css;
	var $js;

	function page($id){
		$this->id = $id;
		$this->css = array();
		$this->js = array();
		$this->setup();
	}
	function setup(){
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

	}
	function header(){
		$header = '    
		<div class="container">
	      <div class="page-header">
	        <h1>'.$this->title.'</h1>
	      </div>';
		return $this->headerBase().$header;
	}
	function footer(){
		$footer = '
		</div>
		    <footer class="footer">
		      <div class="container">
		        <p class="text-muted"><span class="glyphicon glyphicon-copyright-mark" aria-hidden="true"></span> Copyright Page-php-bootstrap</p>
		      </div>
		    </footer>';
		return $footer.$this->footerBase();
	}
	function addCss($css){
		$this->css[] = $css;
	}
	function addJs($js){
		$this->js[] = $js;
	}
	function display(){
		echo $this->header().$this->html.$this->footer();
	}
	function displayHeader(){
		echo $this->header();
	}
	function displayFooter(){
		echo $this->footer();
	}
	function displayHeaderBase(){
		echo $this->headerBase();
	}
	function displayFooterBase(){
		echo $this->footerBase();
	}
	function headerBase(){
		return '
			<!DOCTYPE html>
			<html lang="en">
			  <head>
			    <meta charset="utf-8">
			    <meta http-equiv="X-UA-Compatible" content="IE=edge">
			    <meta name="viewport" content="width=device-width, initial-scale=1">
			    <meta name="description" content="'.$this->desc.'">
				<meta name="keywords" content="'.$this->tag.'">

			    <title>'.$this->title.$this->sep.$this->site_title.'</title>

			    '.$this->getHtmlCss().'
			    <!--[if lt IE 9]>
			      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
			    <![endif]-->
			  </head>
			  <body>';
	}
	function footerBase(){
		return $this->getHtmlJs().'
		  </body>
		</html>';
	}
	function getHtmlCss(){
		$html = implode('" rel="stylesheet"><link href="', $this->css);
		return empty($html) ? '' : '<link href="'.$html.'" rel="stylesheet">';
	}
	function getHtmlJs(){
		$html = implode('"></script><script src="', $this->js);
		return empty($html) ? '' : '<script src="'.$html.'"></script>';
	}
}
?>




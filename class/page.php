<?php
abstract class page {
    
    public  $id;
    public  $title;
    public  $site_title;
    public  $sep;
    public  $desc;
    public  $tag;
    private  $css;
    private  $js;

    public function __construct($id){
        $this->id = $id;
        $this->css = array();
        $this->js = array();
    }

    abstract protected function header();
    abstract protected function footer();

    private function headerBase(){
        return '
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="'.$this->desc.'">
                <meta name="keywords" content="'.$this->tag.'">
                <link rel="apple-touch-icon" sizes="57x57" href="ico/apple-icon-57x57.png">
                <link rel="apple-touch-icon" sizes="60x60" href="ico/apple-icon-60x60.png">
                <link rel="apple-touch-icon" sizes="72x72" href="ico/apple-icon-72x72.png">
                <link rel="apple-touch-icon" sizes="76x76" href="ico/apple-icon-76x76.png">
                <link rel="apple-touch-icon" sizes="114x114" href="ico/apple-icon-114x114.png">
                <link rel="apple-touch-icon" sizes="120x120" href="ico/apple-icon-120x120.png">
                <link rel="apple-touch-icon" sizes="144x144" href="ico/apple-icon-144x144.png">
                <link rel="apple-touch-icon" sizes="152x152" href="ico/apple-icon-152x152.png">
                <link rel="apple-touch-icon" sizes="180x180" href="ico/apple-icon-180x180.png">
                <link rel="icon" type="image/png" sizes="192x192"  href="ico/android-icon-192x192.png">
                <link rel="icon" type="image/png" sizes="32x32" href="ico/favicon-32x32.png">
                <link rel="icon" type="image/png" sizes="96x96" href="ico/favicon-96x96.png">
                <link rel="icon" type="image/png" sizes="16x16" href="ico/favicon-16x16.png">
                <link rel="manifest" href="ico/manifest.json">
                <meta name="msapplication-TileColor" content="#ffffff">
                <meta name="msapplication-TileImage" content="ico/ms-icon-144x144.png">
                <meta name="theme-color" content="#ffffff">

                <title>'.$this->title.$this->sep.$this->site_title.'</title>

                '.$this->getHtmlCss().'
                <!--[if lt IE 9]>
                  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
                  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
                <![endif]-->
              </head>
              <body>';
    }
    private function footerBase(){
        return $this->getHtmlJs().'
          </body>
        </html>';
    }
    private function getHtmlCss(){
        $html = implode('" rel="stylesheet"><link href="', $this->css);
        return empty($html) ? '' : '<link href="'.$html.'" rel="stylesheet">';
    }
    private function getHtmlJs(){
        $html = implode('"></script><script src="', $this->js);
        return empty($html) ? '' : '<script src="'.$html.'"></script>';
    }
    public function addCss($css){
        $this->css[] = $css;
    }
    public function addJs($js){
        $this->js[] = $js;
    }
    public function display(){
        echo $this->headerBase().$this->header().$this->html.$this->footer().$this->footerBase();
    }
    public function displayHeader(){
        echo $this->headerBase().$this->header();
    }
    public function displayFooter(){
        echo $this->footer().$this->footerBase();
    }
    public function displayHeaderBase(){
        echo $this->headerBase();
    }
    public function displayFooterBase(){
        echo $this->footerBase();
    }
}
?>




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




$(function() {
  $( "#form-signin" ).submit(function( event ) {
      event.preventDefault();
      //$( "#btn-submit").addClass("preloading");
      //$( "#btn-submit").removeClass("btn btn-lg btn-default btn-block");
       //$( "#btn-submit").addClass("loading");
       //$( "#btn-submit").html("");
       //$( "#btn-submit").removeClass("btn btn-lg btn-default btn-block");
       $this = $(this);
       $.ajax({
          url: $this.attr('action'),
          type: $this.attr('method'),
          data: $this.serialize(), 
          dataType: "json",
          success: function(result) { 
              if(result.logged){
                window.location.href =  "home.php";
              }else{
                $this.effect( "shake" );
                $("#inputPassword").val('').focus();
              }
              
             
          }
      });
 });
});
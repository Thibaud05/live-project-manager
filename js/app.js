var socket = io.connect('http://localhost:3000');
$(function () {
  console.log("ok");
    $('.form-signin').on('submit', function(e) {
        e.preventDefault();
 
        var $this = $(this);
 
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        

        socket.emit('login', { "email":email , "password":password });
    });
});

socket.on('news', function (data) {
  console.log(data);
});
socket.on('logged', function (data) {
    if(data.logged){
      $('.form-signin').animate({
        opacity: 0,
        marginTop: "0px"
      },{
        duration: 500,
        specialEasing: {
          width: "linear",
          height: "easeOutCubic"
        },
        complete: function() {
          $('body').html(data.html)
        }
      });   
    }else{
      $('.form-signin').effect( "shake" );
      $("#inputPassword").val('').focus();
    }
})

socket.on('changeNbUser', function (html) {
  $('#usersLogged').html(html)
})

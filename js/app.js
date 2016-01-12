var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
  console.log(data);
  $(function () {

      $('.form-signin').on('submit', function(e) {
          e.preventDefault();
   
          var $this = $(this);
   
          var email = $('#inputEmail').val();
          var password = $('#inputPassword').val();
          

          socket.emit('login', { "email":email , "password":password });
      });
  });
});

socket.on('logged', function (data) {
    if(data.logged){
         $('body').html(data.html)
    }
})

socket.on('changeNbUser', function (html) {
  $('#usersLogged').html(html)
})

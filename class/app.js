'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersLogged = 0
    }

    login(data)
    {
        var newUser = data
        for (var user of this.users) {
            if( data.email == user.email && data.password == user.password ){
                if( !user.logged ){
                    this.usersLogged ++
                }
                user.logged = true
                newUser = user
            }
        }
        console.log(this.users)
        return newUser
    }

    getNbUserLogged()
    {
        var str = this.usersLogged 
        if(str < 2){
            str += " utilisateur connecté"
        }else{
            str += " utilisateurs connectés"
        }
        return str
    }

    displayHome()
    {

    }

    displayLogin()
    {
        return '<html lang="en"> ' +
  '<head> ' +
    '<meta charset="utf-8"> ' +
    '<meta http-equiv="X-UA-Compatible" content="IE=edge"> ' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"> ' +
    '<meta name="description" content=""> ' +
    '<meta name="author" content=""> ' +
    '<link rel="icon" href="../../favicon.ico"> ' +
    '<title>Signin Template for Bootstrap</title> ' +
    '<link href="css/bootstrap.min.css" rel="stylesheet"> ' +
    '<link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet"> ' +
    '<link href="css/signin.css" rel="stylesheet"> ' +
    '<script src="/socket.io/socket.io.js"></script> ' +

    '<!--[if lt IE 9]> ' +
      '<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> ' +
      '<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> ' +
    '<![endif]--> ' +
  '</head> ' +
  '<body> ' +
    '<div class="container"> ' +
        '<div class="form-signin"> ' +
            '<div class="LPMrond"><img src="img/lpm-big.png" /></div> ' +
            '<form id="form-signin" method="POST" action="login.php" > ' +
                '<label for="inputEmail" class="sr-only">Email address</label> ' +
                '<input name="email" type="email" id="inputEmail" class="form-control" placeholder="Votre@e-mail.fr" required="" autofocus=""> ' +
                '<label for="inputPassword" class="sr-only">Password</label> ' +
                '<input name="password" type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" required=""> ' +
                '<br> ' +
                '<button type="submit" id="btn-submit" class="btn btn-lg btn-default btn-block">Connexion</button> ' +
            '</form> ' +
        '</div> ' +
    '</div> <!-- /container --> ' +
    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> ' +
    '<script src="js/bootstrap.min.js"></script> ' +
    '<script src="js/app.js"></script> ' +
    '<script src="js/ie10-viewport-bug-workaround.js"></script> ' +
  '</body> ' +
'</html>';
    }

}
module.exports=app;
'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersLogged = 0
        this.appVersion = "v1"
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

    header(u)
    {
        console.log(u.getFullName())
        return '<div class="bar"><div class="stripHead"></div>' +
                '<div class="head">' +
                '<div class="logoLpm"><img src="img/lpm.png" /></div>' + this.barContent() + 
                    '<ul class="nav navbar-right" role="tablist">' +
                      '<li role="presentation" class="dropdown">' +
                        '<a id="user" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
                           u.getFullName() +
                          '<span class="caret"></span>' +
                        '</a>' +
                        '<ul id="menu3" class="dropdown-menu" aria-labelledby="user">' +
                          '<li><a href="#">Mon compte</a></li>' +
                          '<li role="separator" class="divider"></li>' +
                          '<li class="dropdown-header">' + this.appVersion + '</li>' +
                          '<li role="separator" class="divider"></li>' +
                          '<li><a href="?logout">Déconnexion</a></li>' +
                        '</ul>' +
                      '</li>' +
                    '</ul>' +
                '<div class="clear"></div>' +
                '</div>' +
                '<div class="strip"><div id="tasksManagerHead"></div></div></div><div class="page">';
    }

    barContent()
    {
        return '<div class="barContent"> ' +
            '<button id="prev" type="button" class="previous btn btn-default" title="Taches précédentes" ><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button> ' +
            '<button type="button" class="btn btn-default" data-toggle="modal" data-target=".bs-task-modal-lg" title="Ajouter une tache"><span id="add_btn" class="glyphicon glyphicon-plus" aria-hidden="true"></span></button> ' +
            '<button id="valid_btn" type="button" class="btn btn-default" title="Valider une tache" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button> ' +
            '<button id="duplicate_btn" type="button" class="btn btn-default" title="Copier une tache"><span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button> ' +
            '<button id="archive_btn" type="button" class="btn btn-default" title="Archiver une tache" ><span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span></button> ' +
            '<button id="del_btn" type="button" class="btn btn-default" title="Supprimer une tache" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button> ' +
            '<button id="next" type="button" class="next btn btn-default" title="Taches suivantes" ><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button> ' +
        '</div>';
    }

    display(u)
    {
        console.log(u)
        return this.header(u) + '<div id="tasksManager"></div><div id="box"></div>' + '</div>'
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
    '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet"> ' +
    '<link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet"> ' +
    '<link href="css/signin.css" rel="stylesheet"> ' +
    '<link href="css/app.css" rel="stylesheet"> ' +
    '<script src="/socket.io/socket.io.js"></script> ' +

    '<!--[if lt IE 9]> ' +
      '<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> ' +
      '<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> ' +
    '<![endif]--> ' +
  '</head> ' +
  '<body> ' +
    '<div class="container"> ' +
        '<div class="form-signin"> ' +
            '<div class="logo"><img src="img/lpm-big.png" /></div> ' +
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
    '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script> ' +
    '<script src="js/bootstrap.min.js"></script> ' +
    '<script src="js/moment.min.js"></script> ' +
    '<script src="js/taskManager.js"></script>' +
    '<script src="js/task.js"></script>' +
    '<script src="js/user.js"></script>' +
    '<script src="js/file.js"></script>' +
    '<script src="js/app.js"></script> ' +
    '<script src="js/ie10-viewport-bug-workaround.js"></script> ' +
  '</body> ' +
'</html>';
    }

}
module.exports=app;
'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersKey = {}
        this.usersLogged = 0
        this.appVersion = "v1"
    }

    controller(socket)
    {
        socket.on('setData', function (data)
        {
            console.log('setData')
            console.log(data)
            var t = new global.task(data)
            io.emit('setData',t.update());
        })

        socket.on('updateTask', function (datas)
        {
            console.log('updateTask')
            for(var i= 0; i < datas.length; i++)
            {
               
                    var data = datas[i]
                if(data != undefined){
                    var t = new global.task(data)
                    io.emit('updateTask',t.update());
                }
            }
        })

        socket.on('moveTask', function (datas)
        {
            console.log("SERVER MOVE TASK")
            console.log(datas)
            
            console.log(datas.length)       

            for(var i= 0; i < datas.length; i++)
            {
                console.log("test")
               var data = datas[i]
                var t = new global.task(data)
                
                io.emit('moveTask',t.update());
            }
            
        })

        socket.on('setDataFiles', function (data)
        {
            fileData = data.files[0];
            fileData.id = "";
            var f = new global.file(fileData);
            f.id_task = data.taskId;
            f.add()
        })

        socket.on('delDataFiles', function (data)
        {
            f = new global.file(data)
            var id = f.id
            f.del()
            io.emit('delDataFiles',id);
        })

        socket.on('addTask', function (data)
        {
            console.log("addTask")
            var t = new global.task(data)
            t.onUpdateCompleted = function(){
                console.log(" add completed")
                //arr.push(this)
                io.emit('addTask',this);
            }
            t.add()
        })

        socket.on('setRelease', function (data)
        {
            var r = new global.release(data)
            r.update()
            io.emit('setRelease',r);
        })

        socket.on('delTask', function (datas){
            for(var i= 0; i < datas.length; i++)
            {
                var data = datas[i]
                var t = new global.task(data);
                var id = t.id
                t.del()
                io.emit('delTask',id);
            }
        })

        socket.on('duplicateTask', function (datas)
        {
            var arr = [];
            console.log('duplicateTask')
            for(var i= 0; i < datas.length; i++)
            {
                var data = datas[i]
                if(data != undefined){
                    var t = new global.task(data)
                    console.log(t)
                    t.onUpdateCompleted = function(){
                        console.log("onUpdateCompleted custom")
                        arr.push(this)
                        console.log(this)
                        io.emit('duplicateTask',this);
                    }
                    t.add()
                    
                    
                    
                }
            }
            //arr
        })
        this.socket = socket
    }

    autoLogin()
    {
       var cookie = this.socket.handshake.headers.cookie.key
       //console.log(this.socket.handshake)
        if( cookie != undefined ){
            var u = this.usersKey[cookie]
            //console.log(u)
            if( u != undefined ){
                //console.log(u)
                this.logged(u)
                var html = this.display(u)
                global.data.connectUserId = u.id
                var obj = {logged:u.logged,key:u.getKey(),html:html,autoLog:1}
                this.socket.emit('logged',{obj:obj,data:global.data});
            }
        }

    }

    login(data)
    {
        var newUser = data
        for (var user of this.users) {
            if( data.email == user.email && data.password == user.password ){
                this.logged(user)
                newUser = user
            }
        }
        return newUser
    }

    logged(user)
    {
        if( !user.logged ){
            this.usersLogged ++
            user.logged = true
        }
        //user.saveKey(this.socket)
    }

    getNbUserLogged()
    {
        return this.usersLogged
        /*var str = this.usersLogged 
        if(str < 2){
            str += " utilisateur connecté"
        }else{
            str += " utilisateurs connectés"
        }
        return str*/
    }

    getUsersList()
    {
        var html = ""
        for (var user of this.users)
        {
            var ico = "glyphicon-remove-sign"
            if(user.logged==1){
                ico = "glyphicon-ok-sign"
            }
            html += '<li><a href="#"><span class="glyphicon ' + ico + '" aria-hidden="true"></span>' + user.firstName + '</a></li>'
        }
        return html
    }

    header(u)
    {
        console.log(u.getFullName())
        return '<div class="bar"><div class="stripHead"></div>' +
                '<div class="head">' +
                '<div class="logoLpm"><img src="img/lpm.png" /></div>' + 
                '<div id="online" class="dropdown"><button type="button" id="dropdownMenu1" class="btn btn-default dropdown-toggle" title="Utilisateurs connectés" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                '<span class="glyphicon glyphicon-user" aria-hidden="true"></span><span id="usersLogged">' + this.usersLogged + '</span> <span class="caret"></span></button>' +
                '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1" id="usersList">'+ this.getUsersList() +'</ul></div>' +
                this.barContent() + 
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

    footer(){
        return '</div>'
    }

    barContent()
    {
        return '<div class="barContent"> ' +
            '<button id="prev" type="button" class="previous btn btn-default" title="Taches précédentes" ><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button> ' +
            '<button id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" title="Ajouter"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button> ' +
            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">' +
                '<li><a id="add_btn" href="#" title="Ajouter une tache">Ajouter une tache </a></li>' +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_release" href="#" title="Ajouter une tache">Ajouter une release </a></li>' +
                this.displayAddReleaseForm() +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_type" href="#" title="Ajouter une tache">Ajouter un type de release </a></li>' +
                this.displayAddTypeForm() +
            '</ul>' +
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
        return this.header(u) + '<div id="tasksManager"></div><div id="box"></div>' + this.footer()
    }

    displayAddReleaseForm()
    {
        return  '<li id="add_release" class="hidden"><form class="form-inline">' +
                    '<select class="form-control">' +
                        '<option>ALPHA</option>' +
                        '<option>DEV</option>' +
                        '<option>QA</option>' +
                        '<option>PRD</option>' +
                    '</select>' +
                    '<select class="form-control">' +
                        '<option>v2</option>' +
                        '<option>v1</option>' +
                    '</select>' +
                    '<button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>' +
                '</form></li>'
    }

    displayAddTypeForm()
    {
        return  '<li id="add_type" class="hidden"><form class="form-inline">' +
                    '<input type="text" class="form-control" placeholder="Title">' +
                    '<select class="form-control">' +
                        '<option>red</option>' +
                        '<option>indigo</option>' +
                        '<option>blue</option>' +
                        '<option>cyan</option>' +
                        '<option>teal</option>' +
                        '<option>green</option>' +
                        '<option>lightGreen</option>' +
                        '<option>yellow200</option>' +
                    '</select>' +
                    '<button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>' +
                '</form></li>'
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
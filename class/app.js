'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersKey = {}
        this.usersLogged = 0
        this.appVersion = "v1"
        this.userBySocket = {}
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

        socket.on('changeRelease', function (data)
        {
            data.t.typeId = data.typeId
            var t = new global.task(data.t)
            io.emit('changeRelease',t.update());
        })
        socket.on('updateTask', function (datas)
        {
            for(var i= 0; i < datas.length; i++)
            {
                var data = datas[i]
                if(data != undefined){
                    var t = new global.task(data)
                    io.emit('updateTask',t.update());
                }
            }
        })

        socket.on('archiveTask', function (datas)
        {
            for(var i= 0; i < datas.length; i++)
            {
                var data = datas[i]
                if(data != undefined){
                    var t = new global.task(data)
                    io.emit('archiveTask',t.update());
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
            console.log("///setDataFiles")
            console.log(data)
            data.id = 0
            var f = new global.file(data);
            console.log("gogogo")
            f.registerEvent("added")
            f.addEventListener("added", function(e){
                io.emit('setDataFiles',f);
            }, false); 
            f.add()
        })

        socket.on('delDataFiles', function (data)
        {
            var f = new global.file(data)
            var id = f.id
            f.del()
            io.emit('delDataFiles',f);
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

        socket.on('addRelease', function (data){
            console.log("socket addrelease")
            var sql = "INSERT INTO `type` (" +
                        "`name`, " +
                        "`color` " +
                    ") VALUES (" +
                        "'" + data.name + "'," +
                        "'" + data.color + "'" +
                    ");"
            global.connection.query(sql, function(err, result) {
                if (err) throw err;
                var typeID = result.insertId;
                io.emit('addType',{id:typeID,name:data.name,color:data.color});
                var today = global.moment().format("YYYY-MM-DD")
                var rAplha = new release({id:0,name:"α",typeId:typeID,day:today})
                var rDEV = new release({id:0,name:"DEV",typeId:typeID,day:today})
                var rQA = new release({id:0,name:"QA",typeId:typeID,day:today})
                var rPRD = new release({id:0,name:"PRD",typeId:typeID,day:today})
                rAplha.save()
                rDEV.save()
                rQA.save()
                rPRD.save()
            });
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
                io.emit('changeNbUser',{nb:this.getNbUserLogged(),list:this.getUsersList()});
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
        user.addSocket( this.socket.id )
        this.userBySocket[this.socket.id] = user
        if( !user.logged ){
            this.usersLogged ++
            user.logged = true
        }
        //user.saveKey(this.socket)
    }
    logout(socketId){
        var user = this.userBySocket[socketId]
        console.log(user)
        if( user!= undefined && user.logged ){
            

            user.delSocket(socketId)
            delete this.userBySocket[socketId]
            console.log(user)
            if( !user.haveSocket() ){
                this.socket.broadcast.emit('notif',{title:user.firstName + " est hors ligne !",body:"Bye bye !",icon:user.getImg(),tag:""});
                this.usersLogged --
                user.logged = false
            }
        }
    }

    getNbUserLogged()
    {
        return this.usersLogged
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
            if(html!=""){
               html += '<li role="separator" class="divider"></li>' 
            }
            html += '<li><a href="#">' + user.getAvatar(32) + '<span class="glyphicon ' + ico + '" aria-hidden="true"></span>' + user.firstName + '</a></li>'
        }
        return html
    }

    header(u)
    {
        console.log(u.getFullName())
        return '<div class="bar"><div class="stripHead"></div>' +
                '<div class="head">' +
                '<div class="logoLpm"><img src="img/lpm.png" /></div>' + 
                '<div id="online" class="dropdown"><button type="button" id="dropdownMenu1" class="btn btn-user dropdown-primary" title="Utilisateurs connectés" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                '<span class="glyphicon glyphicon-user" aria-hidden="true"></span><span id="usersLogged">' + this.usersLogged + '</span></button>' +
                '<div id="config">' + this.displayConfig() + '</div>' +
                '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1" id="usersList">'+ this.getUsersList() +'</ul></div>' +
                this.barContent() + 
                    '<div class="nav navbar-right" id="user"><span class="name">' +
                      u.firstName + 
                        '</span><a  href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + 
                          u.getAvatar(32) +
                        '</a>' +
                        '<div id="menu3" class="dropdown-menu" aria-labelledby="user">' +
                        '<div class="panel panel-default"><div class="panel-body">' + 
                        '<div class="row"><div class="col-md-4">' +
                        '<a id="editAvatar" href="#"><div style="background:url(img/user/' + u.id + '.jpg);width:96px;height:96px;overflow: hidden;" class="img-circle bgAvatar"><span class="edit">Modifier</span><div class="progressBar"></div></div></a>' + 
                        '</div>' + 
                        '<div class="col-md-8">' + 
                        '<b>' + u.getFullName() + '</b><br>' + 
                        '<i>' + u.email + '</i><br>' + 
                        '<a href="#" id="btnConfig">Configuration</a>' +
                        '</div></div></div><div class="panel-footer">'+ this.appVersion + '<a id="logout" class="btn btn-default pull-right" href="#">Déconnexion</a><div class="clearfix"></div></div></div>' +
                        '</div>' +
                      '</div>' +
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
            '<button id="prev" type="button" class="previous btn btn-primary" title="Taches précédentes" ><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button> ' +
            '<button id="dropdownMenu2" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" title="Ajouter"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button> ' +
            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">' +
                '<li><a id="add_btn" href="#" title="Ajouter une tache">Ajouter une tache </a></li>' +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_release" href="#" title="Ajouter une tache">Ajouter une release </a></li>' +
                this.displayAddReleaseForm() +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_type" href="#" title="Ajouter une tache">Ajouter un type de release </a></li>' +
                this.displayAddTypeForm() +
            '</ul>' +
            '<button id="valid_btn" type="button" class="btn btn-primary" title="Valider une tache" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button> ' +
            '<button id="duplicate_btn" type="button" class="btn btn-primary" title="Copier une tache"><span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button> ' +
            '<button id="archive_btn" type="button" class="btn btn-primary" title="Archiver une tache" ><span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span></button> ' +
            '<button id="del_btn" type="button" class="btn btn-primary" title="Supprimer une tache" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button> ' +
            '<button id="next" type="button" class="next btn btn-primary" title="Taches suivantes" ><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button> ' +
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
                    '<a href="#" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
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
                    '<a href="#" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
                '</form></li>'
    }

    displayConfig()
    {
        return '<div class="panel panel-default">' +
          '<div class="panel-heading"><h3 class="panel-title"><span class="glyphicon glyphicon-bell" aria-hidden="true"></span> Notifications center</h3></div>' +
          '<div class="panel-body">Connexion / Déconnexion</div>' +
        '</div>'
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
    '<script src="/siofu/client.js"></script>' +

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
                '<button type="submit" id="btn-submit" class="btn btn-lg btn-primary btn-block">Connexion</button> ' +
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
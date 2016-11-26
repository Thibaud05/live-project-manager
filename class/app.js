'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersKey = {}
        this.usersLogged = 0
        this.ts = 165
        this.appVersion = "v1.2." + this.ts
        this.userBySocket = {}
    }

    controller(socket)
    {
        var self = this;
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
            data.id = 0
            var f = new global.file(data);
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


        socket.on('setDataLinks', function (data)
        {
            data.id = 0
            var l = new global.link(data);
            self.checkUrlExists(l.link,function(urlExists){
                if(urlExists){
                    l.registerEvent("added")
                    l.addEventListener("added", function(e){
                        io.emit('setDataLinks',l);
                    }, false); 
                    l.add()
                }
                socket.emit('checkUrlExists',{urlExists:urlExists,taskId:l.taskId});
            })
        })

        socket.on('delDataLinks', function (data)
        {
            var l = new global.link(data)
            var id = l.id
            l.del()
            io.emit('delDataLinks',l);
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
            var type = new global.type(data);
            type.save();      
        })
        this.socket = socket
    }

    autoLogin()
    {

       var cookie = null
       if(this.socket.handshake.headers.cookie){
        cookie = this.socket.handshake.headers.cookie.key
       }
       //console.log(this.socket.handshake)
        if( cookie != undefined ){
            var u = this.usersKey[cookie]
            //console.log(u)
            if( u != undefined ){
                //console.log(u)
                this.logged(u)
                var html = this.display(u)
                global.data.connectUserId = u.id
                global.data.users[u.id].logged = true 
                var obj = {logged:u.logged,key:u.getKey(),html:html,autoLog:1}
                this.socket.emit('logged',{obj:obj,data:global.data});
                io.emit('loginUser',u.id);
                return true
            }
        }
        return false

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
            this.socket.broadcast.emit('notif',{title:user.firstName + " est en ligne !",body:"Hello World !",icon:user.getImg(),tag:"connect",userId:user.id});
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
                this.socket.broadcast.emit('notif',{title:user.firstName + " est hors ligne !",body:"Bye bye !",icon:user.getImg(),tag:"deco",userId:user.id});
                this.usersLogged --
                user.logged = false
                global.data.users[user.id].logged = false
                io.emit('logoutUser',user.id);
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

    checkUrlExists(Url, callback) {
        var http = require('http'),
            url = require('url');
        var options = {
            method: 'HEAD',
            host: url.parse(Url).host,
            port: 80,
            path: url.parse(Url).pathname
        };
        var req = http.request(options, function (r) {
            callback( r.statusCode == 200 || r.statusCode == 301);
        });
        req.end();
    }

    header(u)
    {
        console.log(u.getFullName())
        return '<div class="bar"><div class="stripHead"></div>' +
                '<div class="head">' +
                '<div class="logoLpm"><img src="img/lpm.png" /></div>' + 
                '<div id="online" class="dropdown"><button type="button" id="dropdownMenu1" class="btn btn-user dropdown-primary" title="Utilisateurs connectés" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                '<span class="glyphicon glyphicon-user" aria-hidden="true"></span><span id="usersLogged"></span></button>' +
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
                this.searchBar() + 
                '</div>' +
                '<div class="strip"><div id="tasksManagerHead"></div></div></div><div class="page">';
    }

    footer(){
        return '</div>'
    }

    barContent()
    {
        return '<div class="barContent btn-group">' +
            this.displayBtn("prev","Taches précédentes","chevron-left") +
            '<div class="btn-group" >' + this.displayBtn("dropdownMenu2","Ajouter","plus",true) + 
            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">' +
                '<li><a id="add_btn_task" href="#" title="Ajouter une tache">Ajouter une tache </a></li>' +
                this.displayAddTask() +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_release" href="#" title="Ajouter une tache">Ajouter une release </a></li>' +
                this.displayAddReleaseForm() +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_type" href="#" title="Ajouter une tache">Ajouter un type de release </a></li>' +
                this.displayAddTypeForm() +
            '</ul></div>' +
            this.displayBtn("search_btn","Rechercher","search") +
            '<div class="btn-group" >' + this.displayBtn("dropdownAccountable","Modifier le responsable","user",true) +
            '<ul id="accountable" class="dropdown-menu" aria-labelledby="dropdownAccountable">' +
                this.displayChangeAccountableForm() +
            '</ul></div>' +
            this.displayBtn("valid_btn","Valider une tache","ok") +
            this.displayBtn("duplicate_btn","Copier une tache","duplicate") + 
            this.displayBtn("archive_btn","Archiver une tache","folder-open") +
            this.displayBtn("del_btn","Supprimer une tache","trash") + 
            this.displayBtn("next","Taches suivantes","chevron-right") + 
        '</div>';
    }

    searchBar()
    {
        return  '<div id="search" class="container"><div class="input-group input-group-lg">' +
                    '<input type="text" id="searchField" class="form-control" placeholder="Rechercher" aria-describedby="sizing-addon1">'+
                    '<span class="input-group-addon" id="sizing-addon1"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>'+
                '</div></div>';
    }

    display(u)
    {
        console.log(u)
        return this.header(u) + '<div id="tasksManager"></div><div id="box"></div>' + this.footer()
    }

    displayBtn(id,title,icon,toggle)
    {
        var toggle = typeof toggle !== 'undefined' ? toggle : false;
        var toggleHtml = ''
        if(toggle){
            toggleHtml = ' dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true'
        }
        return  '<button id="' + id + '" type="button" class="btn btn-primary' + toggleHtml + '" title="' + title + '" >' +
                    '<span class="glyphicon glyphicon-' + icon + '" aria-hidden="true"></span>' +
                '</button>'
    }

    displayChangeAccountableForm()
    {
        var html = ''
        for (var user of this.users) {
            html += '<li><a href="#" data-value="' + user.id + '">' + user.getFullName() + '</a></li>'
        }
        return html
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
                    '<select class="form-control project">' +
                    '</select>' +
                    '<select class="form-control color">' +
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

    displayAddTask()
    {
        return  '<li id="add_task" class="hidden"><form class="form-inline">' +
            '<select class="form-control project">' +
            '</select>' +
            '<a href="#" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
        '</form></li>';
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
    '<title>LPM - Live project manager</title> ' +
    '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet"> ' +
    '<link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet"> ' +
    '<link href="css/signin.css" rel="stylesheet"> ' +
    '<link href="css/app.css?' + this.ts + '" rel="stylesheet"> ' +
    '<link href="css/chat.css?' + this.ts + '" rel="stylesheet"> ' +
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
    //'<script src="js/config.js?' + this.ts + '"></script>' +
    //'<script src="js/taskManager.js?' + this.ts + '"></script>' +
    //'<script src="js/task.js?' + this.ts + '"></script>' +
    //'<script src="js/user.js?' + this.ts + '"></script>' +
    //'<script src="js/file.js?' + this.ts + '"></script>' +
    '<script src="js/bundle.js?' + this.ts + '"></script> ' +
    '<script src="js/ie10-viewport-bug-workaround.js"></script> ' +
  '</body> ' +
'</html>';
    }

}
module.exports=app;
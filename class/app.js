'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersKey = {}
        this.usersLogged = 0
        this.ts = 232
        this.appVersion = "v1.2." + this.ts
        this.userBySocket = {}
    }

    controller(socket)
    {
        var self = this;
        socket.on('setData', function (data)
        {
            console.log('setData')
            //console.log(data)
            var t = new global.task(data)
            io.emit('setData',t.update());
        })

        socket.on('changeRelease', function (data)
        {
            console.log('changeRelease')
            data.t.typeId = data.typeId
            var t = new global.task(data.t)
            io.emit('changeRelease',t.update());

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
            //console.log(datas)
            
            //console.log(datas.length)       

            for(var i= 0; i < datas.length; i++)
            {
                //console.log("test")
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

        socket.on('setDataMessages', function (data)
        {
            data.id = 0
            var m = new global.message(data);
            m.registerEvent("added")
            m.addEventListener("added", function(e){
                console.log("Server emit setDataMessages")
                io.emit('setDataMessages',m);
            }, false); 
            m.add()
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
            var type = new global.type(data);
            type.save();      
        })

        socket.on('addDeadLine', function (data){
            var startDay = global.moment().startOf('week');
            var deadLine = new global.release({id:0,name:data.name,typeId:data.typeId,day:startDay.add(1, 'd').format("YYYY-MM-DD")})
            deadLine.save()    
        })


        

        socket.on('selectProject', function(idProject){
            self.users[socket.connectUserId].selectProject(idProject)
        })
    }

    autoLogin(socket)
    {

       var cookie = null
       if(socket.handshake.headers.cookie){
        cookie = socket.handshake.headers.cookie.key
       }
       //console.log(socket.handshake)
        if( cookie != undefined ){
            var u = this.usersKey[cookie]
            //console.log(u)
            if( u != undefined ){
                this.logged(u,socket)
                var html = this.display(u)
                this.users[u.id].logged = true 
                socket.connectUserId = u.id
                var obj = {logged:u.logged,key:u.getKey(),html:html,autoLog:1,connectUserId:u.id,selectedProject:u.selectedProject}
                socket.emit('logged',{obj:obj,data:global.store.getClientData(u.id)});
                io.emit('loginUser',u.id);
                return true
            }
        }
        return false

    }

    getUserByEmail(email)
    {
        var userFinded = false
        for (var user of this.users) {
            if( email == user.email ){
                userFinded = user
            }
        }
        return userFinded
    }


    login(data,socket)
    {
        var newUser = data
        for (var user of this.users) {
            if( data.email == user.email && data.password == user.password ){
                this.logged(user,socket)
                newUser = user
            }
        }
        return newUser
    }

    logged(user,socket)
    {
        user.addSocket(socket.id )
        this.userBySocket[socket.id] = user
        if( !user.logged ){
            this.usersLogged ++
            user.logged = true
            socket.broadcast.emit('notif',{title:user.firstName + " est en ligne !",body:"Hello World !",icon:user.getImg(),tag:"connect",userId:user.id});
        }
        //user.saveKey(this.socket)
    }
    logout(socket){
        var user = this.userBySocket[socket.id]
        
        //console.log(user)
        if( user!= undefined && user.logged ){
            

            user.delSocket(socket.id)
            delete this.userBySocket[socket.id]
            //console.log(user)
            if( !user.haveSocket() ){
                socket.broadcast.emit('notif',{title:user.firstName + " est hors ligne !",body:"Bye bye !",icon:user.getImg(),tag:"deco",userId:user.id});
                this.usersLogged --
                user.logged = false
                this.users[user.id].logged = false
                io.emit('logoutUser',user.id);
            }
        }
    }

    checkUrlExists(link, callback) {
        var http = require('http'),
            url = require('url');
        var options = {
            method: 'HEAD',
            host: url.parse(link).host,
            port: 80,
            path: url.parse(link).pathname
        };
        var req = http.request(options, function (r) {
            callback( r.statusCode == 200 || r.statusCode == 301);
        });
        req.end();
    }  

    displaychangePassword(hash){
        var validHash = false
        for (var user of this.users) {
            if( hash == user.resetPassword){
                validHash = true
            }
        }
        if(validHash){

        
        var ok = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>'
        var title = 'LPM - Live pro manager';
        var content =   '<div id="loader"><img src="/img/loading.svg" /></div>' +
        '<div class="container"> ' +
            '<div class="form-signin"> ' +
                '<div class="logo"><img src="/img/lpm-big.svg" /></div> '+
                '<p><h1>Changer de mot de passe</h1>Votre mot de passe doit contenir au moins :'+
                '<ul><li><span id="check-maj-letter" style="display:none;">' + ok + '</span> Une lettre majuscule</li>'+
                '<li><span id="check-min-letter" style="display:none;">' + ok + '</span> Une lettre minuscule</li> '+
                '<li><span id="check-number" style="display:none;">' + ok + '</span> Un chiffre</li>'+
                '<li><span id="check-special-char" style="display:none;">' + ok + '</span> Un caractère spécial (!@#$%^&\')</li>'+
                '</ul>'+
                '</p>' +
                '<form id="form-changePassword" method="POST" action="" > ' +
                    '<div class="form-group">' +
                        '<label for="inputPassword" class="sr-only">Password</label> ' +
                        '<input name="password" type="password" id="pw-input" class="form-control" placeholder="Mot de passe" required=""> ' +
                        '<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' + 
                    '</div>' + 
                    '<div class="form-group" >' +
                        '<label for="inputPasswordConfirmation" class="sr-only">Password Confirmation</label> ' +
                        '<input name="passwordConfirmation" type="password" id="pw-confirmation-input" class="form-control" placeholder="Confirmer votre mot de passe" required=""> ' +
                        '<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' + 
                    '</div>' + 
                     '<input name="hash" type="hidden" id="hash" value="' + hash + '"> ' +
                    '<br>' +
                    '<button disabled type="submit" id="btn-submit" class="btn btn-lg btn-primary btn-block">Changer</button> ' +
                    '<br> ' +
                '</form> ' +
            '</div> ' +
        '</div> <!-- /container --> ';
        return this.displayPage(title,content);
    }else{
        return this.displayPage("Erreur","Lien expiré");
    }
    }

    header(u)
    {
        console.log(u.getFullName())
        return '<div class="bar"><div class="stripHead"></div>' +
                '<div class="head">' +
                '<div class="logoLpm"><img src="img/lpm.svg" /></div>' + 
                '<div id="config">' + this.displayConfig() + '</div>' +
                this.barContent() + 
                    '<div class="nav navbar-right" id="user"><a  href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + 
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
                '<div class="strip"><div id="tasksManagerHead"></div></div></div><div id="screenContainer" class="page">';
    }

    footer(){
        return '</div>'
    }

    barContent()
    {
        return '<div class="barContent btn-group">' +
            this.displayBtn("prev","Taches précédentes","chevron-left") +
            '<div id="dropdownAdd" class="btn-group" >' + this.displayBtn("dropdownMenu2","Ajouter","plus",true) + 
            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">' +
                '<li><a id="add_btn_task" href="#" title="Ajouter un ticket">Ajouter un ticket </a></li>' +
                this.displayAddTask() +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_type" href="#" title="Ajouter un type de ticket">Ajouter un type de ticket </a></li>' +
                this.displayAddTypeForm() +
                '<li role="separator" class="divider"></li>' + 
                '<li><a id="add_btn_release" href="#" title="Ajouter un jalon">Ajouter un jalon </a></li>' +
                this.displayAddReleaseForm() +
            '</ul></div>' +
            this.displayBtn("search_btn","Rechercher","search") +
            '<div class="btn-group" >' + this.displayBtn("dropdownAccountable","Modifier le responsable","user",true) +
            '<ul id="accountable" class="dropdown-menu" aria-labelledby="dropdownAccountable">' +
            '</ul></div>' +
            //this.displayBtn("progress_btn","Ticket en cours","refresh") +
            //this.displayBtn("valid_btn","Valider un ticket","ok") +
            //this.displayBtn("duplicate_btn","Copier un ticket","duplicate") + 
            //this.displayBtn("archive_btn","Archiver un ticket","folder-open") +
            //this.displayBtn("del_btn","Supprimer un ticket","trash") + 
            this.displayBtn("next","Sickets suivantes","chevron-right") + 
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
        //console.log(u)
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

    displayAddReleaseForm()
    {
        return  '<li id="add_release" class="hidden"><form class="form-inline">' +
                    '<input type="text" class="form-control" placeholder="Title">' +
                    '<select class="form-control form-type">' +
                    '</select>' +
                    '<a href="#" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
                '</form></li>'
    }

    displayAddTypeForm()
    {
        return  '<li id="add_type" class="hidden"><form class="form-inline">' +
                    '<input type="text" class="form-control" placeholder="Title">' +
                    '<select class="form-control color">' +
                        '<option>red</option>' +
                        '<option>pink</option>' +
                        '<option>deepPurpule</option>' +
                        '<option>indigo</option>' +
                        '<option>blue</option>' +
                        '<option>cyan</option>' +
                        '<option>teal</option>' +
                        '<option>green</option>' +
                        '<option>lightGreen</option>' +
                        '<option>amber</option>' +
                        '<option>orange</option>' +
                        '<option>brown</option>' +
                        '<option>grey</option>' +
                        '<option>blueGrey</option>' +
                        '<option>yellow200</option>' +
                    '</select>' +
                    '<a href="#" class="btn btn-default"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
                '</form></li>'
    }

    displayAddTask()
    {
        return  '<li id="add_task" class="hidden"><form class="form-inline">' +
            '<select class="form-control form-type">' +
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

    displayForgotPassword(){
        var title = 'LPM - Live pro manager';
        var content =   '<div id="loader"><img src="/img/loading.svg" /></div>' +
        '<div class="container"> ' +
            '<div class="form-signin"> ' +
                '<div class="logo"><img src="img/lpm-big.svg" /></div> ' +
                '<form id="form-forgotPassword" method="POST" action="" > ' +
                    '<label for="inputEmail" class="sr-only">Email address</label> ' +
                    '<input name="email" type="email" id="inputEmail" class="form-control" placeholder="Votre@e-mail.fr" required="" autofocus=""> ' +
                    '<button type="submit" id="btn-submit" class="btn btn-lg btn-primary btn-block">Envoyer</button> ' +
                '</form> ' +
            '</div> ' +
        '</div> <!-- /container --> ';
        return this.displayPage(title,content);
    }
    displayLogin(){
        var title = 'LPM - Live pro manager';
        var content =   '<div id="loader"><img src="/img/loading.svg" /></div>' +
        '<div class="container"> ' +
            '<div class="form-signin"> ' +
                '<div class="logo"><img src="img/lpm-big.svg" /></div> ' +
                '<form id="form-signin" method="POST" action="" > ' +
                    '<label for="inputEmail" class="sr-only">Email address</label> ' +
                    '<input name="email" type="email" id="inputEmail" class="form-control" placeholder="Votre@e-mail.fr" required="" autofocus=""> ' +
                    '<label for="inputPassword" class="sr-only">Password</label> ' +
                    '<input name="password" type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" required=""> ' +
                    '<br> ' +
                    '<button type="submit" id="btn-submit" class="btn btn-lg btn-primary btn-block">Connexion</button> ' +
                    '<br> ' +
                    '<div class="text-center"><a class="forgotPassword" href="forgotPassword">Mot de passe oublié ?</a></div>' +
                '</form> ' +
            '</div> ' +
        '</div> <!-- /container --> ';
        return this.displayPage(title,content);
    }

    displayPage(title,content)
    {
        return '<html lang="en"> ' +
          '<head> ' +
            '<meta charset="utf-8"> ' +
            '<meta http-equiv="X-UA-Compatible" content="IE=edge"> ' +
            '<meta name="viewport" content="width=device-width, initial-scale=1"> ' +
            '<meta name="description" content=""> ' +
            '<meta name="author" content=""> ' +
            this.getFavicon() + 
            '<title>'+ title + '</title> ' +
            '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet"> ' +
            //'<link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet"> ' +
            '<link href="/css/signin.css" rel="stylesheet"> ' +
            '<link href="/css/app.css?' + this.ts + '" rel="stylesheet"> ' +
            '<link href="/css/chat.css?' + this.ts + '" rel="stylesheet"> ' +
            '<link href="/css/project.css?' + this.ts + '" rel="stylesheet"> ' +
            '<script src="/socket.io/socket.io.js"></script> ' +
            '<script src="/siofu/client.js"></script>' +

            '<!--[if lt IE 9]> ' +
              '<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> ' +
              '<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> ' +
            '<![endif]--> ' +
          '</head> ' +
          '<body> ' + content + 
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> ' +
            '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script> ' +
            '<script src="/js/bootstrap.min.js"></script> ' +
            '<script src="/js/moment.min.js"></script> ' +
            '<script src="/js/bundle.js?' + this.ts + '"></script> ' +
          '</body> ' +
        '</html>';
    }

    getFavicon(){
        return (
            '<link rel="apple-touch-icon" sizes="57x57" href="/icon/apple-icon-57x57.png">' +
            '<link rel="apple-touch-icon" sizes="60x60" href="/icon/apple-icon-60x60.png">' +
            '<link rel="apple-touch-icon" sizes="72x72" href="/icon/apple-icon-72x72.png">' +
            '<link rel="apple-touch-icon" sizes="76x76" href="/icon/apple-icon-76x76.png">' +
            '<link rel="apple-touch-icon" sizes="114x114" href="/icon/apple-icon-114x114.png">' +
            '<link rel="apple-touch-icon" sizes="120x120" href="/icon/apple-icon-120x120.png">' +
            '<link rel="apple-touch-icon" sizes="144x144" href="/icon/apple-icon-144x144.png">' +
            '<link rel="apple-touch-icon" sizes="152x152" href="/icon/apple-icon-152x152.png">' +
            '<link rel="apple-touch-icon" sizes="180x180" href="/icon/apple-icon-180x180.png">' +
            '<link rel="icon" type="image/png" sizes="192x192"  href="/icon/android-icon-192x192.png">' +
            '<link rel="icon" type="image/png" sizes="32x32" href="/icon/favicon-32x32.png">' +
            '<link rel="icon" type="image/png" sizes="96x96" href="/icon/favicon-96x96.png">' +
            '<link rel="icon" type="image/png" sizes="16x16" href="/icon/favicon-16x16.png">' +
            '<link rel="manifest" href="/icon/manifest.json">' +
            '<meta name="msapplication-TileColor" content="#ffffff">' +
            '<meta name="msapplication-TileImage" content="/icon/ms-icon-144x144.png">' +
            '<meta name="theme-color" content="#ffffff">'
        )
    }

}
module.exports=app;


  //////////////////////////////////////////
  //
  //  TASK OBJECT
  //
  //////////////////////////////////////////
  function task(data){

    this.isOpen = false;
    this.isDraging = false;
    this.id = data.id;
    this.typeId = data.typeId;
    this.userId = data.userId;
    if(data.day != "0000-00-00"){
      this.day = moment(data.day).format('YYYY-MM-DD');
    }else{
      this.day = data.day
    }
    this.creationDate = data.creationDate;
    this.creationUserId = data.creationUserId;
    this.accountableUserId = data.accountableUserId;
    this.updateDate = data.updateDate;
    this.title = data.title;
    this.description = data.description;
    this.files = [];
    this.priority = data.priority
    this.w = 0
    this.h = 0
    this.valid = data.valid
    this.initPosition
    var self = this;
}

task.prototype = {
    getTitle : function(){
      if (this.title == ""){
        return "Sans titre"
      }else{
        return this.title
      }
    },

    getDescription : function(){
      if (this.description == ""){
        return "Sans descriptif"
      }else{
        return this.description
      }
    },

    open: function(htmlTask)
    {
      var self = this
      var htmlTitle = htmlTask.children(".contener").children("span")
      htmlTask.find("#taskDetail").remove();
      var description = this.description;
      var taskId = this.id;

      htmlTask.parent().enableSelection(); 

      if (description == ""){description = "Sans descriptif";}
      if (this.title == ""){htmlTask.htmlTitle.html("Sans titre");}
      
      var p = htmlTask.position();

      htmlTask.css("position","absolute");
      this.initPosition = p;
      this.w = htmlTask.width();
      this.h = htmlTask.height();
      htmlTask.css({
        "z-index":1000,
        "left":p.left,
        "top":p.top,
        "cursor":"default"
      });
      htmlTask.animate({
        left:0,
        top:$("body").scrollTop(),
        width:  "100%",
        height:  "100%",
      }, 400, function() {
        htmlTask.css({"text-align":"left"});
        htmlTitle.css({"display":"block"});
        $("body").css("overflow","hidden");

        var html = '<div id="taskDetail"><div id="closeTask">X</div>';

     html +='<div id="upload"><button id="upload_btn" class="btn fileinput-button"><span > \
        <i class="glyphicon glyphicon-plus"></i> \
         \
    </span></button> \
               <div id="progress" class="progress"> \
        <div class="progress-bar progress-bar-success"></div> \
    </div> \
    </div>';

    html += self.displayFiles();
        moment.locale('fr');
        html += '<p><button id="shifting_prev" type="button" class="btn btn-default" title="Avancer à la release précédente">' +
        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>';
                html += ' <button id="shifting_next" type="button" class="btn btn-default" title="Repousser à la prochaine release">' +
        '<span  class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></p>';
        html += '<p>Responsable : ' + self.getCreationUser() + ", créé "+ moment(self.creationDate).fromNow() + '<p>';
        html += '<p>Attribué à ' + self.getEditUser() + '<p>';
        html += '<p class="desc">' + description + '<p>';
        html += '</div>';

        htmlTask.find("#taskDetail").remove();
        htmlTask.children(".contener").append(html);

        $('.removeFile').click(function(){
          var fid = $(this).attr('fid');
          var parent = $(this).parent();
          socket.emit('delDataFiles', self.files[fid]);
        });
        
    self.siofu = new SocketIOFileUpload(socket);

    $("#shifting_prev").click(function(){
      var prev = tm.getNextRelease(self.typeId,true)
      if(prev){
        socket.emit('changeRelease', {"t":self,"typeId":prev});
      }
    });

    $("#shifting_next").click(function(){
      var next = tm.getNextRelease(self.typeId,false)
      if(next){
        socket.emit('changeRelease', {"t":self,"typeId":next});
      }
    });
    //siofu.listenOnInput($("#upload_btn"));
    $("#upload_btn").click(self.siofu.prompt)

    //siofu.listenOnDrop($("#file"));

    self.siofu.addEventListener("start", function(event){
        console.log("startUpload");
        $('#progress .progress-bar').css('width',0);
    });

    // Do something on upload progress:
    self.siofu.addEventListener("progress", function(event){
        var percent = event.bytesLoaded / event.file.size * 100;
        console.log("File is", percent.toFixed(2), "percent loaded");
        $('#progress .progress-bar').css('width',percent + '%');
    });

    // Do something when a file is uploaded:
    self.siofu.addEventListener("complete", function(event){

        if(event.success){
        socket.emit('setDataFiles', {title:event.file.name,type:event.file.type,taskId:taskId});
        $('#progress .progress-bar').delay(800).queue(function (next) {
            $(this).css('width',0);
              next();
            });
        }
    });
    

        $("#closeTask").click(function() {
          self.close(htmlTask);
          $("body").css("overflow","auto");
        });

         // Edition du descriptif
        htmlTask.find(".desc").unbind('dblclick').dblclick(function() {
          if(!this.editMode){
              var parent = this;
              var content = $(this).html().replace(/<br>/g,'\n');
              if (content == "Sans descriptif"){content = "";}
              $(this).html("<textarea >" + content + "</textarea >");
              $(this).children("textarea").focus();
              $(this).children("textarea").select();
              this.editMode = true;
              $(this).children("textarea").blur(function() {
                content = $(this).val().replace(/\n\r?/g, '<br>');
                parent.editMode = false;
                self.description = content;
                self.save();
                if (content == ""){content = "Sans descriptif";}
                $(parent).html(content);
              });
          }
        });

      });
      htmlTitle.css({
        "vertical-align": "initial",
        "text-align": "left",
         "margin-left":"20px"
      });
      htmlTitle.animate({
        "font-size": "60px"
      });

        // Edition du titre
      htmlTitle.dblclick(function() {
        if(!this.editMode){
          var parent = this;
          var content = $(this).html();
          if (content == "Sans titre"){content = "";}
          $(this).html("<input type='text' value='" + content + "' />");
          $(this).children("input").focus();
          $(this).children("input").select();
          this.editMode = true;
          $(this).children("input").blur(function() {
            content = $(this).val();
            parent.editMode = false;
            self.title = content;
            self.save();
            if (content == ""){content = "Sans titre";}
            $(parent).html(content);
          });
        }
      });
      this.isOpen = true;
      htmlTask.addClass('disable-task');
    },



    /////////////////////
    // masquage du details de la tache

    close: function(htmlTask){
      $("#upload_btn").off()
      $("#shifting_prev").off()
      $("#shifting_next").off()
      this.siofu.removeEventListener("start")
      this.siofu.removeEventListener("progress")
      this.siofu.removeEventListener("complete")
      this.siofu.destroy();
      this.siofu = null;

      var htmlTitle = htmlTask.children(".contener").children("span")
      var p = this.initPosition;
      var w = this.w;
      var h = this.h;
      htmlTask.children(".contener").children("#taskDetail").remove();
      htmlTitle.unbind('dblclick');
      htmlTask.animate({
        left:p.left,
        top:p.top,
        width:  w,
        height:  h
      }, 400, function() {
        htmlTask.css({
          "left":"inherit",
          "top":"inherit",
          "position":"relative",
          "z-index":"auto"
        });
        htmlTitle.css({"display":"table-cell"});
      });
      htmlTitle.css({
        "vertical-align": "middle",
        "text-align": "center"
      });
      htmlTitle.animate({
        "font-size": "14px"
      });
      this.isOpen = false;
      htmlTask.removeClass('disable-task');
    },

    /////////////////////
    // affichage du nom de l'utilisateur

    getCreationUser :function(){
      var user = tm.getUser(this.creationUserId);
      if (user != undefined){
        return user.getName();
      }
    },

    /////////////////////
    // affichage du nom de l'utilisateur

    getEditUser :function(){
      var user = tm.getUser(this.accountableUserId);
      if (user != undefined){
        return user.getName();
      }
    },

    /////////////////////
    // Sauvegarde d'une tache

    save :function(){
      if(this.day != "0000-00-00"){
        this.accountableUserId = this.userId
      }
      socket.emit('setData', this);
    },
    update : function(data){
        this.typeId = data.typeId;
        this.userId = data.userId;
        if(data.day != "0000-00-00"){
          this.day = moment(data.day).format('YYYY-MM-DD');
        }else{
          this.day = data.day
        }
        this.creationDate = data.creationDate;
        this.creationUserId = data.creationUserId;
        this.accountableUserId = data.accountableUserId;
        this.updateDate = data.updateDate;
        this.title = data.title;
        this.description = data.description;
        this.priority = data.priority
        this.valid = data.valid
    },

    displayFiles :function(){
      var html = '<div id="files" class="files">';
      $.each( this.files, function( key, data ) {
        if(data){
          var objFile = new file({id:data.id,id_task:self.id,title:data.name,type:data.type});
          html += objFile.display();
        }
      });
      return html + '</div>';
    }
}

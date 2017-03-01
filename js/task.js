var socket = window.socket
var chat = require("./chat.js");
class task{
  constructor(data){
    this.isOpen = false;
    this.isDraging = false;
    this.id = data.id;
    this.typeId = data.typeId;
    this.userId = data.userId;
    if(data.day != "0000-00-00"){
      this.day = moment(data.day,'YYYY-MM-DD').format('YYYY-MM-DD');
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
    this.links = [];
    this.messages = [];
    this.priority = data.priority
    this.w = 0
    this.h = 0
    this.valid = data.valid
    this.initPosition
    this.id_project = data.id_project
    this.chat = null
    this.isLocked = (window.tm.selectedProject != this.id_project);
    var self = this;
  }

  getTitle(){
    if (this.title == ""){
      return "Sans titre"
    }else{
      return this.title
    }
  }

  getDescription(){
    if (this.description == ""){
      return "Sans descriptif"
    }else{
      return this.description
    }
  }

  open(htmlTask){
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
      var html =  '<div id="taskDetail"><div class="chat"></div>';
      html +='<div id="closeTask"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>';

      html +='<div class="attach-conainer"><div id="upload">' + self.getAttachBtn() + '</div>';

      html += self.displayFiles();
      moment.locale('fr');
      html += '</div><p><button id="shifting_prev" type="button" class="btn btn-default" title="Avancer à la release précédente">' +
      '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>';
      html += ' <button id="shifting_next" type="button" class="btn btn-default" title="Repousser à la prochaine release">' +
      '<span  class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></p>';
      html += '<p>ID : ' + self.id + '</p>';
      html += '<p>Responsable : ' + self.getCreationUser() + ", créé "+ moment(self.creationDate,'YYYY-MM-DD').fromNow() + '</p>';
      html += '<p>Attribué à ' + self.getEditUser() + '</p>';
      html += self.displayLinks();
      html += '<p class="desc">' + description + '</p>';
      html += '</div>';

      htmlTask.find("#taskDetail").remove();
      htmlTask.children(".contener").append(html);

      self.removeFile()
      self.removeLink()
      self.attachBtnOnClcik();

      self.chat = new chat(".chat",self.messages,self.id)

  self.siofu = new SocketIOFileUpload(socket);

  $("#shifting_prev").click(function(){
    var prev = window.tm.getNextRelease(self.typeId,true)
    if(prev){
      socket.emit('changeRelease', {"t":self,"typeId":prev});
    }
  });

  $("#shifting_next").click(function(){
    var next = window.tm.getNextRelease(self.typeId,false)
    if(next){
      socket.emit('changeRelease', {"t":self,"typeId":next});
    }
  });
  //siofu.listenOnInput($("#upload_btn"));
  //siofu.listenOnDrop($("#file"));

  self.siofu.addEventListener("start", function(event){
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
  }

  getProgressBar(){
    return '<div id="progress" class="progress"><div class="progress-bar progress-bar-success"></div></div>';
  }

  getAttachBtn(){
    return '<button id="attach_btn" class="btn btn-attach"><span ><i class="glyphicon glyphicon-plus"></i></span></button>' + this.getProgressBar();
  }

  attachBtnOnClcik(){
    var self = this;
    $("#attach_btn").click(function() {
      var html = '<button id="link_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-link"></i> Add link</span></button>'
      html += '<button id="upload_btn" class="btn btn-attach-mini fileinput-button"><span ><i class="glyphicon glyphicon-upload"></i> Add File</span></button>'
      html += self.getProgressBar();
      $("#upload").html(html);
      $("#upload_btn").click(self.siofu.prompt)
      $("#link_btn").click(function() {
        html = '<div class="link-form"><div class="input-group"><span class="input-group-addon" id="basic-addon">Title</span>';
        html += '<input type="text" class="form-control" id="link-title" aria-describedby="basic-addon"></div>';
        html += '<div class="input-group"><span class="input-group-addon" id="basic-addon2">Link</span>';
        html += '<input type="text" class="form-control" id="link-url" aria-describedby="basic-addon2"></div></div>';
        $("#files").prepend(html);

        html = '<button id="remove_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-remove"></i></span></button>';
        html += '<button id="ok_btn" class="btn btn-attach-mini"><span ><i class="glyphicon glyphicon-ok"></i></span></button>';
        html += self.getProgressBar();
        $("#upload").html(html);

        $("#link-title").focus();

        $("#remove_btn").click(function() {
          $(".link-form").remove();
          $("#upload").html(self.getAttachBtn());
          self.attachBtnOnClcik();
        }); 

        $("#ok_btn").click(function() {
          var title = $("#link-title").val()
          var link = $("#link-url").val()
          $(".form-control").removeClass("error");
          if(title == ""){
            $("#link-title").addClass("error");
          }
          if(link == ""){
            $("#link-url").addClass("error");
          }

          if(title!="" && link != ""){

            var data = {title:title,url:link,taskId:self.id}
            socket.emit('setDataLinks', data);
          }else{
            $(".link-form").effect("shake",{direction :"up"});
          }
        });
      });
    });
  }
  removeFile()
  {
      var self = this
      $('.removeFile').off()
      $('.removeFile').click(function(){
        var fid = $(this).attr('fid');
        socket.emit('delDataFiles', self.files[fid]);
      });
  }

  removeLink()
  {
      var self = this
      $('.removeLink').off()  
      $('.removeLink').click(function(){
        var lid = $(this).attr('lid');
        socket.emit('delDataLinks', self.links[lid]);
      });
  }
    /////////////////////
    // masquage du details de la tache

    close(htmlTask){
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
    }

    /////////////////////
    // affichage du nom de l'utilisateur

    getCreationUser(){
      var user = window.tm.getUser(this.creationUserId);
      if (user != undefined){
        return user.getName();
      }
    }

    /////////////////////
    // affichage du nom de l'utilisateur

    getEditUser(){
      var user = window.tm.getUser(this.accountableUserId);
      if (user != undefined){
        return user.getName();
      }
    }

    /////////////////////
    // Sauvegarde d'une tache

    save(){
      if(this.day != "0000-00-00"){
        this.accountableUserId = this.userId
      }
      socket.emit('setData', this);
    }
    update(data){
        this.typeId = data.typeId;
        this.userId = data.userId;
        if(data.day != "0000-00-00"){
          this.day = moment(data.day,'YYYY-MM-DD').format('YYYY-MM-DD');
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
    }

    displayFiles(){
      var html = '<div id="files" class="files">';
      $.each( this.files, function( key, file ) {
        if(file){
          html += file.display();
        }
      });
      return html + '</div>';
    }

    displayLinks(){
      var html = '<div class="links">';
      $.each( this.links, function( key, link ) {
        if(link){
          html += link.display();
        }
      });
      return html + '</div>';
    }

    getNextPriority(tasks,priority){
      var k = this.userId + ":" + this.day;
      if(tasks[k][priority] != undefined ){
        return this.getNextPriority(tasks,priority+1);
      }else{
        return priority;
      }
    }
}
module.exports = task;
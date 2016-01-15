

  //////////////////////////////////////////
  //
  //  TASK OBJECT
  //
  //////////////////////////////////////////
  function task(data){
    this.isOpen = false;
    this.isDraging = false;
    this.id = data.id;
    this.id_type = data.id_type;
    this.id_user = data.id_user;
    this.day = data.day;
    this.creationDate = data.creationDate;
    this.creationUser = data.creationUser;
    this.accountableUser = data.accountableUser;
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
    open: function(htmlTask){
      var htmlTitle = htmlTask.children(".contener").children("span")
      htmlTask.parent().enableSelection(); 
      var self = this
      var description = this.description;
      var taskId = this.id;
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

     html +='<div id="upload"><span class="btn fileinput-button"> \
        <i class="glyphicon glyphicon-plus"></i> \
        <input id="fileupload" type="file" name="files[]" multiple> \
    </span> \
               <div id="progress" class="progress"> \
        <div class="progress-bar progress-bar-success"></div> \
    </div> \
    </div>';
    html += self.displayFiles();
        moment.locale('fr');
        html += '<p><button type="button" class="btn btn-default" title="Repousser à la prochaine release"><span id="shifting_btn" class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></p>';
        html += '<p>Créer par ' + self.getEditUser() + " "+ moment(self.creationDate).fromNow() + '<p>';
        html += '<p>Edité par ' + self.getCreationUser() + " "+ moment(self.updateDate).fromNow() + '<p>';
        html += '<p class="desc">' + description + '<p>';
        html += '</div>';
        htmlTask.children(".contener").append(html);

        $('.removeFile').click(function(){
          var fid = $(this).attr('fid');
          var parent = $(this).parent();
          $.ajax({
              url: "data.php",
              data: {
                a: "delDataFiles",
                obj:JSON.stringify(self.files[fid])
              },
              success: function( data ) {
                parent.remove();
                delete self.files.splice(fid, 1);
              }
            });
        });
    $('#fileupload').fileupload({
        url: 'server/',
        dataType: 'json',
        done: function (e, data) {
          $('#progress .progress-bar')
            .delay(800)
            .queue(function (next) {
            $(this).css('width',0);
              next();
            });


            $.ajax({
              url: "data.php",
              data: {
                a: "setDataFiles",
                obj:JSON.stringify({files:data.result.files,taskId:taskId})
              },
              success: function( data ) {
                data = $.parseJSON(data);
                self.files[data.id] = new file(data);
              }
            });


            $.each(data.result.files, function (index, file) {

                if (file.url) {
                  var thumbnail = "";
                  if(file.thumbnailUrl){
                      thumbnail = '<img src="' + file.thumbnailUrl + '" />';
                  }
                  html = '<a target="_blank" class="file" href="' + file.url + '" ><div class="content">' + thumbnail + '</div>' + file.name + '</a>';
                } else if (file.error) {
                  html  = '<span class="text-danger">' + file.error + '<br>' + error + '</span>'
                }
                $('#files').append(html);


            });
        },
        progress : function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');




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
                self.save(htmlTask);
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
            self.save(htmlTask);
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
        "font-size": "16px"
      });
      this.isOpen = false;
      htmlTask.removeClass('disable-task');
    },

    /////////////////////
    // affichage du nom de l'utilisateur

    getCreationUser :function(){
      var user = tasksManager.getUser(this.creationUser);
      if (user != undefined){
        return user.getName();
      }
    },

    /////////////////////
    // affichage du nom de l'utilisateur

    getEditUser :function(){
      var user = tasksManager.getUser(this.accountableUser);
      if (user != undefined){
        return user.getName();
      }
    },

    /////////////////////
    // Sauvegarde d'une tache

    save :function(htmlTask){
      this.accountableUser = tasksManager.connectUserId;
      $.ajax({
        url: "data.php",
        data: {
          a: "setData",
          obj:JSON.stringify(this)
        },
        success: function( data ) {
          tasksManager.save();
        }
      });
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

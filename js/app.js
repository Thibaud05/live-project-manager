
var socket = require("./socket.js");
var tasksManager = require("./tasksManager.js");
var tm = new tasksManager();
window.tm = tm

$(function () {

  $('.form-signin').css({ opacity: 0 ,marginTop: "0px"})
  // Login form
  $('#form-signin').on('submit', function(e) {
      e.preventDefault();
      var email = $('#inputEmail').val();
      var password = $('#inputPassword').val();
      socket.emit('login', { "email":email , "password":password });
  });
  // Forgot password form
  $('#form-forgotPassword').on('submit', function(e) {
      e.preventDefault();
      var email = $('#inputEmail').val();
      socket.emit('forgotPassword', email);
  });

    // Forgot password form
  $('#form-changePassword').on('submit', function(e) {
      e.preventDefault();
      var password = $('#pw-input').val();
      var hash = $('#hash').val();
      socket.emit('changePassword', {password:password,hash:hash});
  });

  var checkPassword = new CheckPassword()

});



socket.on('forgotPassword', function (haveAccount) {
  if(haveAccount){
    var html = '<div class="send-message"><span class="glyphicon glyphicon-send" aria-hidden="true"></span>'
    html += 'Un email vous à été envoyé pour changer votre mots de passe !</div>'
    $('.form-signin').append(html)
    $('#form-forgotPassword').remove()
  }else{
    $('.form-signin').effect( "shake" );
    //$("#inputPassword").val('').focus();
  }
})


socket.on('changePassword', function () {
   window.location.href = '/';
})

socket.on('notif', function (data) {
  var options = {
      body: data.body,
      icon: data.icon,
      tag: data.tag
  }
  if(tm.isUserDisplay(data.userId)){
    if (!("Notification" in window)) {
      alert("Ce navigateur ne supporte pas les notifications desktop");
    }
    else if (Notification.permission === "granted") {
      var notification = new Notification(data.title,options);
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) {
          Notification.permission = permission;
        }
        if (permission === "granted") {
          var notification = new Notification(data.title,options);
        }
      });
    }
  }
});
socket.on('displayLogin', function (data) {
  $('.form-signin').animate({opacity: 1,marginTop: "150px"},{
    duration: 500,
    easing: "easeOutCubic"
  })
  $('#loader').css("animation", "none");
  $('#loader').animate({opacity: 0,marginTop: "150px"},{
    duration: 500,
    easing: "easeOutCubic"
  })
})

socket.on('logged', function (json) {
  console.log("login")
  var data = json.obj
  json.data.connectUserId = json.obj.connectUserId
  json.data.selectedProject = json.obj.selectedProject
    if(data.logged){
      createCookie("key", data.key,30)
      if(data.autoLog){
            $('.form-signin').remove()
            $('body').html(data.html)
            $('.strip').css({ "margin-left": "-200px",opacity:0})
            $('.bar').css({ opacity: 0 ,top:-50})
            appInit(json.data)
            $('.bar').animate({opacity: 1,top: 0},{
              duration: 500,
              easing: "easeOutCubic",
              complete: function() {
              }
            })
      }else{
        $('.form-signin').animate({opacity: 0, marginTop: "0px"},{
          duration: 500,
          easing: "easeOutCubic",
          complete: function() {
            $('body').html(data.html)
            $('.strip').css({ "margin-left": "-200px",opacity:0})
            $('.bar').css({ opacity: 0 ,top:-50})
            $('.bar').animate({opacity: 1,top: 0},{
              duration: 500,
              easing: "easeOutCubic",
              complete: function() {
                appInit(json.data)
              }
            })
          }
        });   
    }
    }else{
      $('.form-signin').effect( "shake" );
      $("#inputPassword").val('').focus();
    }
})

socket.on('loginUser', function (id_user) {
  console.log("loginUser")
  if( tm.users[id_user] != undefined){
    tm.users[id_user].logged = true
    var cible = $(".avatar" + id_user).parent().find(".glyphicon")
   	cible.removeClass("glyphicon-remove-sign")
   	cible.addClass("glyphicon-ok-sign")
  }
})

socket.on('logoutUser', function (id_user) {
  tm.users[id_user].logged = false
    var cible = $(".avatar" + id_user).parent().find(".glyphicon")
   cible.removeClass("glyphicon-ok-sign")
   cible.addClass("glyphicon-remove-sign")
})


moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui]",
        nextDay: '[Demain]',
        nextWeek: 'dddd []',
        lastDay: '[Hier]',
        lastWeek: 'dddd',
        sameElse: 'dddd L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
var debug = true;
function log(msg){
  if(debug){
    console.log(msg);
  }
} 
function appInit(data) {
  console.log("init")

  ////////////////////////////////////////////
  //
  //  EVENT MANAGEMEMENT
  //
  ////////////////////////////////////////////
  tm.init()
  tm.getData(data)
  tm.render()
  tm.activate()
  tm.sockets()
  tm.disabledTaskBtn(true)

  


  $('.box').css({"margin-top": "-20px",opacity:0})
  $('.strip').animate({"margin-left": "0",opacity:1},{duration: 500, easing:"easeOutCubic"})
  setTimeout(showTaskManager, 200)

  function showTaskManager(){
      $('#tasksManager').css({"margin-top": "-200px",opacity:0})
      $('#tasksManager').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic"})
      setTimeout(showBox, 200)
  }

  function showBox(){
    $('.box').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic"})
  }






  //////////////////////
  // Week navigation

   $( "#prev" ).click(function() {
    tm.changeInterval(-1);
    $( this ).blur()
   });
   $( "#next" ).click(function() {
    tm.changeInterval(1);
    $( this ).blur()
   }); 

  //////////////////////
  // Remove selected task
  var searchIsOpen = false 
   $( "#search_btn" ).click(function() {
    if(searchIsOpen){
      $( "#search" ).hide()
      $(".page").css("padding-top","91px")
      searchIsOpen = false
    }else{
      $( "#search" ).show()
      $(".page").css("padding-top","137px")
      searchIsOpen = true
    }
    $( this ).blur()
   });


  //////////////////////
  // Remove selected task

  $("#del_btn").mousedown(function() {
      tm.delSelectedTasks();
  });
  $( "#del_btn" ).click(function() {
    $( this ).blur()
  }); 

  $("#archive_btn").mousedown(function() {
    if (confirm("Voulez-vous archiver cette tache ?")) {
      tm.archiveSelectedTasks();
    }
  });
  $( "#archive_btn" ).click(function() {
    $( this ).blur()
  }); 

  $('html').keydown(function(e){
      if(e.keyCode == 46){
          tm.delSelectedTasks();
      }
  }) 

  $( "#next" ).after( tm.getProjects());

  tm.btnProjectHandler();

/*
  $("#projects").on('mousedown', 'li a', function(){
    var idProject = $(this).data('value')
    tm.toogleProject(idProject)
    $(this).children( ".glyphicon" ).toggleClass("glyphicon-eye-close").toggleClass("glyphicon-eye-open")
  });

*/

  //////////////////////
  // Accountable selected task
  $("#dropdownAccountable").mousedown(function() {
    tm.select = true;
  });

  //////////////////////
  // Duplicate selected task

   $( "#duplicate_btn" ).mousedown(function() {
    tm.duplicateTask()
  }); 

  $( "#duplicate_btn" ).click(function() {
    $( this ).blur()
  }); 

  //////////////////////
  // valid selected task

   $( "#valid_btn" ).mousedown(function() {
    tm.validTask()
  }); 

  $( "#valid_btn" ).click(function() {
    $( this ).blur()
  }); 


  //////////////////////
  // valid selected task

   $( "#progress_btn" ).mousedown(function() {
    tm.progressTask()
  }); 

  $( "#progress_btn" ).click(function() {
    $( this ).blur()
  }); 


  //////////////////////
  // Add a new task

  $('.dropdown-menu').find('form').click(function (e) {
    e.stopPropagation();
  });
  $('#dropdownAdd').on('hide.bs.dropdown', function () {
    $('#add_task').toggleClass("hidden",true)
    $('#add_release').toggleClass("hidden",true)
    $('#add_type').toggleClass("hidden",true)
  })
    

  $( "#add_btn_task" ).click(function(e) {
    e.stopPropagation();
    $('#add_task .form-type option').remove();
    $('#add_task .form-type').html(tm.getTypeList());
    $('#add_task').toggleClass("hidden")
    $('#add_release').toggleClass("hidden",true)
    $('#add_type').toggleClass("hidden",true)
  }); 

  $('#add_btn_release').click(function (e) {
    e.stopPropagation();
    $('#add_release .form-type option').remove();
    $('#add_release .form-type').html(tm.getTypeList());
    $('#add_release').toggleClass("hidden")
    $('#add_task').toggleClass("hidden",true)
    $('#add_type').toggleClass("hidden",true)
  });

  $('#add_btn_type').click(function (e) {
    e.stopPropagation();
    $('#add_type').toggleClass("hidden")
    $('#add_task').toggleClass("hidden",true)
    $('#add_release').toggleClass("hidden",true)
  });




 $('#add_task a').click(function (e) {
  var type = $('#add_task .form-type').val()
  tm.newTask(type);
  $('#add_task').toggleClass("hidden",true)
  $('#dropdownAdd').toggleClass("open",false)
 })

 $('#add_type a').click(function (e) {
  var name = $('#add_type input').val()
  var color = $('#add_type .color').val()
  socket.emit('addRelease', {name:name,color:color,id_project:tm.selectedProject});
  $('#add_type').toggleClass("hidden",true)
  $('#dropdownAdd').toggleClass("open",false)

 })
 /*
$('#add_type .color').change(function (e) {
  var color = this.val()
  $('#add_type .colorPreview').
})*/
//
 $('#add_release a').click(function (e) {
  var name = $('#add_release input').val()
  var typeId = $('#add_release .form-type').val()
  socket.emit('addDeadLine', {name:name,typeId:typeId});
  $('#add_release').toggleClass("hidden",true)
  $('#dropdownAdd').toggleClass("open",false)
 })



  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  //////////////////////
  // Search engine

  $('#searchField').keyup(function() {
      var field = $(this)
      delay(function(){
        tm.search(field.val())
      }, 400 );
  });

  $('#logout').click(function (e) {
    e.stopPropagation();
    createCookie("key","",-1)
    document.location.href=""
  });

  $('#btnConfig').click(function (e) {
    e.stopPropagation();
    $('#config').show();
  });

  $('#editAvatar').click(function (e) {
    e.stopPropagation();
    console.log("ooo")
    //
    var avatarUpload = new SocketIOFileUpload(socket);

    avatarUpload.prompt()

    $('#user > a').dropdown('toggle')

    avatarUpload.addEventListener("progress", function(event){
        var percent = event.bytesLoaded / event.file.size * 100;
        $('#editAvatar .progressBar').css('width',percent + '%');
    });

    avatarUpload.addEventListener("complete", function(event){
       if(event.success){
          socket.emit('uploadAvatar', {title:event.file.name,type:event.file.type});
           $('#editAvatar .progressBar').delay(800).queue(function (next) {
              $(this).css('width',0);
                next();
              });
          }
          avatarUpload.destroy();
          avatarUpload = null;
    })
  });

};

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

String.prototype.contain = function (str) {
    return this.toLowerCase().indexOf(str.toLowerCase()) > -1
};


class CheckPassword 
{
  constructor()
  {
    this.password = ""
    this.passwordConfirmation = ""
    this.valid = false
    this.confirmation = false
    $("#pw-input").keyup($.proxy(this.onChangePasssword, this))
    $("#pw-confirmation-input").keyup($.proxy(this.onChangePasswordConfirmation, this))
  }

  onChangePasssword(event)
  {
    this.password = $(event.currentTarget).val()
    var haveNumber = this.check("#check-number","0-9")
    var haveMinLetter = this.check("#check-min-letter","a-z")
    var haveMajLetter = this.check("#check-maj-letter","A-Z")
    var haveSpecialChar = this.check("#check-special-char","@#$%^&+=")
    this.valid = haveNumber && haveMinLetter && haveMajLetter && haveSpecialChar
    console.log($(event.currentTarget).parent())
    $(event.currentTarget).parent().toggleClass('has-feedback',this.valid);
    this.updateSubmit()
  }

  onChangePasswordConfirmation(event)
  {
    this.passwordConfirmation = $(event.currentTarget).val()
    this.confirmation = ( this.passwordConfirmation == this.password )
    $(event.currentTarget).parent().toggleClass('has-feedback',this.confirmation && this.valid);
    this.updateSubmit()
  }

  updateSubmit(){
    $("#btn-submit").prop('disabled',!(this.confirmation && this.valid) )
  }

  check(id,regex)
  {
    var patt = new RegExp("^(?=.*[" + regex + "]).{1,}$");
    var match = patt.test(this.password)
    if(match){
      $(id).show()
    }else{
      $(id).hide()
    }
    return match
  }

  isValid()
  {
    return this.valid
  }

  get()
  {
    return this.password
  }
}
var socket = io.connect(host);
$(function () {

  $('.form-signin').css({ opacity: 0 ,marginTop: "0px"})
    $('.form-signin').on('submit', function(e) {
        e.preventDefault();
 
        var $this = $(this);
 
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        socket.emit('login', { "email":email , "password":password });
    });
});

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
})

socket.on('logged', function (json) {
  var data = json.obj
    if(data.logged){
      createCookie("key", data.key,30)
      if(data.autoLog){
            $('.form-signin').remove()
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
  if( tm != undefined){
    tm.users[id_user].logged = true
    updateUserList()
  }
})

socket.on('logoutUser', function (id_user) {
  tm.users[id_user].logged = false
  updateUserList()
})


moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
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
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
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
var tm
function appInit(data) {
  console.log("init")
  tm = new tasksManager();

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
  $('.strip').animate({"margin-left": "0",opacity:1},{duration: 500, easing:"easeOutCubic",
    complete: function() {

      $('#tasksManager').css({"margin-top": "-200px",opacity:0})
      $('#tasksManager').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic",
        complete: function() {
          
          $('.box').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic"})

        }
      })
    }
  })

  updateUserList()
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
      $(".page").css("padding-top","151px")
      searchIsOpen = false
    }else{
      $( "#search" ).show()
      $(".page").css("padding-top","197px")
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
    tm.archiveSelectedTasks();
  });
  $( "#archive_btn" ).click(function() {
    $( this ).blur()
  }); 

  $('html').keydown(function(e){
      if(e.keyCode == 46){
        tm.delSelectedTasks();
      }
  }) 

  $( "#online" ).after( tm.getProjects());

  $("#projects").on('mousedown', 'li a', function(){
    var idProject = $(this).data('value')
    tm.toogleProject(idProject)
    updateUserList()
    $(this).children( ".glyphicon" ).toggleClass("glyphicon-eye-close").toggleClass("glyphicon-eye-open")
  });






  //////////////////////
  // Accountable selected task
  $("#dropdownAccountable").mousedown(function() {
    tm.select = true;
    console.log("oups")
  });

  $("#accountable").on('mousedown', 'li a', function(){

    var idUser = $(this).data('value')
    tm.assignAccountable(idUser)
  });

  $("#accountable").on('click', 'li a', function(){
    $( this ).blur()
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
  // Add a new task

  $('.dropdown-menu').find('form').click(function (e) {
    e.stopPropagation();
  });

  $( "#add_btn_task" ).click(function(e) {
    e.stopPropagation();
    $('#add_task .project option').remove();
    $('#add_task .project').html(tm.getProjectList());
    $('#add_task').toggleClass("hidden")
  }); 

  $('#add_btn_release').click(function (e) {
    e.stopPropagation();
    $('#add_release').toggleClass("hidden")
  });

  $('#add_btn_type').click(function (e) {
    e.stopPropagation();
    $('#add_type .project option').remove();
    $('#add_type .project').html(tm.getProjectList());
    $('#add_type').toggleClass("hidden")
  });

 $('#add_task a').click(function (e) {
  console.log("addTask")
  var project = $('#add_task .project').val()
  tm.newTask(project);
 })

 $('#add_release a').click(function (e) {
  console.log("addRelease")
 })

 $('#add_type a').click(function (e) {
  console.log("addRelease")
  var id_project = $('#add_type .project').val()
  var name = $('#add_type input').val()
  var color = $('#add_type .color').val()
  socket.emit('addRelease', {name:name,color:color,id_project:id_project});
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

function updateUserList(){
  var data = tm.getUsersList()
  $('#usersLogged').html(data.nb)
  $('#usersList').html(data.list)
}

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
var socket = io.connect('http://localhost:3000');
$(function () {

  $('.form-signin').css({ opacity: 0 ,marginTop: "0px"})
  $('.form-signin').animate({opacity: 1,marginTop: "150px"},{
            duration: 500,
            easing: "easeOutCubic"
          })

  console.log("ok");
    $('.form-signin').on('submit', function(e) {
        e.preventDefault();
 
        var $this = $(this);
 
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        
        socket.emit('login', { "email":email , "password":password });
    });
});

socket.on('news', function (data) {
  console.log(data);
});

socket.on('logged', function (json) {
  var data = json.obj
    if(data.logged){
      createCookie("key", data.key, { expires : 30 })
      if(data.autoLog){
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
            console.log("ok1");
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

socket.on('changeNbUser', function (data) {
  $('#usersLogged').html(data.nb)
  $('#usersList').html(data.list)
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
function appInit(data) {
  console.log("init")
  var tm = new tasksManager();

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

  $('.strip').animate({"margin-left": "0",opacity:1},{duration: 500, easing:"easeOutCubic",
    complete: function() {
      $('#tasksManager').css({"margin-top": "-200px",opacity:0})
      $('#tasksManager').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic",
        complete: function() {
          $('.box').animate({"margin-top": "-20px",opacity:0})
          $('.box').animate({"margin-top": "0px",opacity:1},{duration: 500, easing:"easeOutCubic"})
        }
      })
    }
  })


  //////////////////////
  // Week navigation

   $( "#prev" ).click(function() {
    tm.changeInterval(-1);
   });
   $( "#next" ).click(function() {
    tm.changeInterval(1);
   });


  //////////////////////
  // Remove selected task

  $("#del_btn").mousedown(function() {
    tm.delSelectedTasks();
  });
  $("#archive_btn").mousedown(function() {
    tm.archiveSelectedTasks();
  });
  $('html').keydown(function(e){
      if(e.keyCode == 46){
        tm.delSelectedTasks();
      }
  }) 


  //////////////////////
  // Duplicate selected task

   $( "#duplicate_btn" ).mousedown(function() {
    tm.duplicateTask()
  }); 

  //////////////////////
  // valid selected task

   $( "#valid_btn" ).mousedown(function() {
    tm.validTask()
  }); 

  //////////////////////
  // Add a new task

   $( "#addTask" ).click(function() {
    var title = $("#addTask-title").val();
    $.ajax({
      url: "data.php",
      dataType: "json",
      data: {
        a: "addTask",
        obj:JSON.stringify({"id":"", "id_user":"", "title":title, "id_type":"", "day":""})
      },
      success: function( task ) {
        tm.addTask(task);
      }
    });
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
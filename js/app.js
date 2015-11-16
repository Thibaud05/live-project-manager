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
var tasksManager = new tasksManager();

$(function() {
  /*
    BOOTSTRAP MODAL FIX
    http://gurde.com/stacked-bootstrap-modals/
  */
  // bug box : l'animation d'appartion part toujour de la premier tache
  $(document)  
    .on('show.bs.modal', '.modal', function(event) {
      $(this).appendTo($('body'));
    })
    .on('shown.bs.modal', '.modal.in', function(event) {
      console.log("ok");
      console.log("///");
      setModalsAndBackdropsOrder();
    })
    .on('hidden.bs.modal', '.modal', function(event) {
      console.log("ok2");
      setModalsAndBackdropsOrder();
    });

  function setModalsAndBackdropsOrder() {  
    var modalZIndex = 1040;
    $('.modal.in').each(function(index) {
      var $modal = $(this);
      modalZIndex++;
      $modal.css('zIndex', modalZIndex);
      $modal.next('.modal-backdrop.in').addClass('hidden').css('zIndex', modalZIndex - 1);
  });
    $('.modal.in:visible:last').focus().next('.modal-backdrop.in').removeClass('hidden');
  }

  
  ////////////////////////////////////////////
  //
  //  EVENT MANAGEMEMENT
  //
  ////////////////////////////////////////////

  
  tasksManager.init();
  tasksManager.getData().done(function(){
    tasksManager.render();
    tasksManager.activate();
  });


  //////////////////////
  // Week navigation

   $( "#prev" ).click(function() {
    tasksManager.changeInterval(-1);
   });
   $( "#next" ).click(function() {
    tasksManager.changeInterval(1);
   });


  //////////////////////
  // Remove selected task

  $("#del_btn").mousedown(function() {
    tasksManager.delSelectedTasks();
  });
  $('html').keydown(function(e){
      if(e.keyCode == 46){
        tasksManager.delSelectedTasks();
      }
  }) 


  //////////////////////
  // Duplicate selected task

   $( "#duplicate_btn" ).mousedown(function() {
    tasksManager.duplicateTask()
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
        tasksManager.addTask(task);
      }
    });
  }); 
});
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

  $("#del_btn").click(function() {
    tasksManager.delSelectedTasks();
  });
  $('html').keydown(function(e){
      if(e.keyCode == 46){
        tasksManager.delSelectedTasks();
      }
  }) 


  //////////////////////
  // Duplicate selected task

   $( "#duplicate_btn" ).click(function() {
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
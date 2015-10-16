<?php
include("class/template.php");
$page = new template("3");
$page->title = "Live project manager";
$page->addCss("css/app.css");
$page->addJs("js/app.js");

$page->addJs("js/upload/jquery.iframe-transport.js");
$page->addJs("js/upload/jquery.fileupload.js");
$page->addCss("css/jquery.fileupload.css");

$page->barContent = '
<div class="barContent">

    <a id="prev" class="previous btn btn-default" href="#" title="Taches précédentes"><span aria-hidden="true">&larr;</span> Précédent</a>
    <button type="button" class="btn btn-default" data-toggle="modal" data-target=".bs-task-modal-lg" title="Ajouter une tache"><span id="add_btn" class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
    <button id="duplicate_btn" type="button" class="btn btn-default" title="Copier une tache"><span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button>
    <button id="del_btn" type="button" class="btn btn-default" title="Supprimer une tache" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
    <a id="next" class="next btn btn-default" href="#" title="Taches suivantes">Suivant <span aria-hidden="true">&rarr;</span></a>
    </div>
';
$page->stripContent ='<div id="tasksManagerHead"></div>';

$page->displayHeader();
?>


<div class="container">
</div>
<div id="tasksManager"></div>
<div id="box">
</div>
<!-- Large modal -->

<div class="modal fade bs-task-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
  <div class="modal-dialog modal-md">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Add a new task</h4>
      </div>
      <div class="modal-body">

      <div class="form-group">
		<label for="exampleInputEmail1">Release</label>
		<div class="input-group"> 
			<select class="form-control">
			  <option>LOT2 QA</option>
			  <option>LOT2 PRD</option>
			  <option>LOT3 QA</option>
			  <option>LOT3 PRD</option>
			  <option>LOT4 QA</option>
			</select>    
			<span class="input-group-addon"><a class="btn btn-sm" href="#"  data-toggle="modal" data-target=".bs-release-modal-lg">>Add a release</a></span>
		</div>
      </div>


     	<div class="form-group">
    		<label for="exampleInputEmail1">Title</label>
        	<input id="addTask-title" type="text" class="form-control" placeholder="Title">
        </div>

		<div class="form-group">
    		<label for="exampleInputEmail1">Description</label>
        	<textarea class="form-control" rows="5" placeholder="Description"></textarea>
        </div>

      <div class="form-group">
		<label for="exampleInputEmail1">Specification</label>
		<div class="input-group"> 
			<select class="form-control">
			  <option>None</option>
			  <option>1 - mass upload</option>
			  <option>2 - Split WH</option>
			</select>    
			<span class="input-group-addon"><a class="btn btn-sm" href="#">Add a specification</a></span>
		</div>
      </div>



      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button id="addTask" type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>





<div class="modal fade bs-release-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
  <div class="modal-dialog modal-md">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Add a new Release</h4>
      </div>
      <div class="modal-body">


     	<div class="form-group">
    		<label for="exampleInputEmail1">Title</label>
        	<input type="text" class="form-control" placeholder="Title">
        </div>

     	<div class="form-group">
    		<label for="exampleInputEmail1">Date</label>
        	<input type="text" class="form-control" placeholder="Title">
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>


<?php
$page->displayFooter();
?>
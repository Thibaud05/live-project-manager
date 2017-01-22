class box{
  constructor(data){
    this.id = data.id;
    this.id_project = data.id_project;
    this.name = data.name;
    this.order = data.order;
  }
  render(){ 
	  var html = ''
	  var htmlTasks = window.tm.taskList.render(this.id + ":0000-00-00",true)
	  if(window.tm.searchValue == "" || htmlTasks != ""){
	    html = '<div class="panel panel-default box">';
	    html += '<div class="panel-heading">' + this.name + '</div>';
	    html +=   '<div class="panel-body">';
	    html +=     '<ul class="connectedSortable" di = "-1" uid ="' + this.id + '">' 
	    html +=       window.tm.taskList.render(this.id + ":0000-00-00",true)
	    html +=     '</ul>'
	    html +=   '</div>';
	    html += '</div>';
	  }
	  return html;
	}
}
module.exports = box;
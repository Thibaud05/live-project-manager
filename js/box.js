class box{
  constructor(data){
    this.id = data.id;
    this.id_project = data.id_project;
    this.name = data.name;
    this.order = data.order;
    this.tasks = [];
  }
  render(){ 
  	if(this.id){
    	this.tasks = window.tm.taskList.getTasks(this.id)
    }
	  var html = ''
	  var uid = ''
	  if(this.id){
	  	uid = '" uid ="' + this.id + '"'
	  }
	  if(window.tm.searchValue == "" || this.tasks.length > 0){
	    html = '<div class="panel panel-default box">';
	    html += '<div class="panel-heading">' + this.name + '</div>';
	    html +=   '<div class="panel-body">';
	    html +=     '<ul class="connectedSortable" di = "-1"' + uid + '>' 
	    html +=       window.tm.taskList.render(this.tasks,true)
	    html +=     '</ul>'
	    html +=   '</div>';
	    html += '</div>';
	  }
	  return html;
	}
}
module.exports = box;
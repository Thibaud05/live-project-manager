class box{
  constructor(data){
    this.id = data.id;
    this.id_project = data.id_project;
    this.name = data.name;
    this.order = data.order;
  }
  render(){ 
	  var html = ''
	  var htmlTasks = this.renderTasks(this.id + ":0000-00-00",true)
	  if(this.searchValue == "" || htmlTasks != ""){
	   
	    html = '<div class="panel panel-default box">';
	    html += '<div class="panel-heading">' + this.name + '</div>';
	    html +=   '<div class="panel-body">';
	    html +=     '<ul class="connectedSortable" di = "-1" uid ="' + this.id + '">' 
	    html +=       this.renderTasks(this.id + ":0000-00-00",true)
	    html +=     '</ul>'
	    html +=   '</div>';
	    html += '</div>';
	  }
	  return html;
	}
}
module.exports = box;
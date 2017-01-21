'use strict'
var Box = require("./box.js");
class BoxList
{
    constructor(){
        this.boxs = []
        this.boxsByProject = []
    }

    setData(data){
    	self = this
        data.map(function(data,key) {
	      if(data!=undefined){
	        var box = new Box(data)
	        self.boxs[box.id] = box;

	        if(self.boxByProjects[box.id_project] == undefined ){
	          self.boxByProjects[box.id_project] = [];
	        }
	        self.boxByProjects[box.id_project][box.order] = box;
	      }
	    })
    }
    render(selectedProject){
    	var html = ""
    	if(this.boxByProject[selectedProject]){
	        for (var key in this.boxByProject[selectedProject]) {
	        	var b = this.boxByProject[selectedProject][key]
	        	if(b!=undefined){
	            	html += this.renderBox(b.name,b.id)
	        	}
	        }
	    }
	    if(this.searchValue!=""){
	        htm += this.renderBox("ARCHIVE",5)
	    }
	    return html;
	}
	
}

module.exports=BoxList;


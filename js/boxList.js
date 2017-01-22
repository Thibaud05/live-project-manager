'use strict'
var Box = require("./box.js");
class BoxList
{
    constructor(){
        this.boxs = []
        this.boxByProject = []
    }

    setData(data){
    	self = this
        data.map(function(data,key) {
	      if(data!=undefined){
	        var box = new Box(data)
	        self.boxs[box.id] = box;

	        if(self.boxByProject[box.id_project] == undefined ){
	          self.boxByProject[box.id_project] = [];
	        }
	        self.boxByProject[box.id_project][box.order] = box;
	      }
	    })
    }
    render(selectedProject){
    	var html =""
	    if(this.boxByProject[selectedProject]){
	        for (var key in this.boxByProject[selectedProject]) {
	          var b = this.boxByProject[selectedProject][key]
	          if(b!=undefined){
	            html += b.render()
	          }
	        }
	    }
		return html
    }

}

module.exports=BoxList;


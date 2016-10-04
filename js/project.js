
//////////////////////////////////////////
//
//  PROJECT OBJECT
//
//////////////////////////////////////////

function project(data){
  this.id = data.id;
  this.name = data.name;
  this.desc = data.desc;
  this.img = data.img;
  this.isPublic = data.isPublic;
  this.id_project = data.id_project;
}

project.prototype = {
  display: function()
  {
    //Todo
    return '';
  },
  displayDetails: function()
  {
    //Todo
    return '';
  }
}

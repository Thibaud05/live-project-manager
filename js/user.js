
//////////////////////////////////////////
//
//  USER OBJECT
//
//////////////////////////////////////////

function user(data){
  this.id = data.id;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.level = data.id_group;
}
    /////////////////////
    //  Nom complet 
user.prototype = {
  getName: function(){
    return this.firstName + " " + this.lastName;
  }
}

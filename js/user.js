
//////////////////////////////////////////
//
//  USER OBJECT
//
//////////////////////////////////////////

function user(data){
  this.id = data.id;
  this.firstname = data.firstname;
  this.lastname = data.lastname;
  this.level = data.level;
}
    /////////////////////
    //  Nom complet 
user.prototype = {
  getName: function(){
    return this.firstname + " " + this.lastname;
  }
}

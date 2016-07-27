
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
  this.display = false
  this.logged = data.logged
}
    /////////////////////
    //  Nom complet 
user.prototype = {
  getName: function(){
    return this.firstName + " " + this.lastName;
  },
  getAvatar: function(size)
  {
      return '<img class="img-circle avatar avatar' + this.id + '" src="img/user/' + this.id + '.jpg" width="' + size + '" height="' + size + '" />' 
  }
}

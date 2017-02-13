'use strict'
class user{
  constructor(data){
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.level = data.id_group;
    this.display = false
    this.logged = data.logged
  }
  getName(){
    return this.firstName + " " + this.lastName;
  }

  getFirstName(){
    return this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1)
  }

  getAvatar(size){
      return '<img class="img-circle avatar avatar' + this.id + '" src="img/user/' + this.id + '.jpg" width="' + size + '" height="' + size + '" />';
  }
  getStatus(){
    var ico = "glyphicon-remove-sign"
    if(this.logged == 1){
      ico = "glyphicon-ok-sign"
    }
    return '<span class="glyphicon ' + ico + '" aria-hidden="true"></span>';
  }
}
module.exports = user;
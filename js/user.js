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

  getAvatar(size){
      return '<img class="img-circle avatar avatar' + this.id + '" src="img/user/' + this.id + '.jpg" width="' + size + '" height="' + size + '" />';
  }
}
module.exports = user;
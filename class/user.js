'use strict'
class user
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id
            this.id_group = data.id_group
            this.email = data.email
            this.password = data.password
            this.firstName = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1)
            this.lastName = data.lastName.toUpperCase();
            this.lastConnexion = data.lastConnexion
            this.autoConnexion = data.autoConnexion
            this.logged = false
            this.sockets = {}
        }
    }

    getFullName()
    {
        return this.firstName + " " + this.lastName
    }

    getAvatar(size)
    {
        return '<img class="img-circle avatar avatar' + this.id + '" src="img/user/' + this.id + '.jpg" width="' + size + '" height="' + size + '" />' 
    }

    getImg()
    {
        return global.config.url + "/img/user/" + this.id + ".jpg"
    }

    getKey()
    {
        var key = this.id + "%:#" + this.email + "/$!" + this.password
        return global.cryptoJs.MD5(key).toString(global.cryptoJs.enc.Base64)
    }

    saveKey(socket){
        var date = new Date();
        date.setTime(date.getTime()+(1000 * 360 * 24 * 365)); // set day value to expiry
        var expires = "; expires="+date.toGMTString();
        socket.handshake.headers.cookie = "key="+this.getKey()+expires+"; path=/";
    }

    addSocket(socketId){
        this.sockets[socketId] = 1
    }

    delSocket(socketId){
        delete this.sockets[socketId]
    }

    haveSocket(){
        return Object.keys(this.sockets).length > 0
    }
}
module.exports=user;
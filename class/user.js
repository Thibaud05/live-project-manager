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
            this.firstName = data.firstName
            this.lastName = data.lastName
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
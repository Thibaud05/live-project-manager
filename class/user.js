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
            if(data.firstName!= undefined){
                this.firstName = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1)
            }
            if(data.lastName!= undefined){
                this.lastName = data.lastName.toUpperCase();
            }
            this.lastConnexion = data.lastConnexion
            this.autoConnexion = data.autoConnexion
            this.selectedProject = data.selectedProject
            this.resetPassword = data.resetPassword
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

    selectProject(idProject){
        this.selectedProject = idProject
        global.connection.query("UPDATE `user` SET `selectedProject` ='" + idProject + "' WHERE `id` = " + this.id )
    }

    saveKey(socket){
        var date = new Date();
        date.setTime(date.getTime()+(1000 * 360 * 24 * 365)); // set day value to expiry
        var expires = "; expires="+date.toGMTString();
        socket.handshake.headers.cookie = "key="+this.getKey()+expires+"; path=/";
    }

    addSocket(socket){
        this.sockets[socket.id] = socket
        if(global.connection){
            global.connection.query("UPDATE `user` SET `lastconnexion` ='" + global.moment().format("YYYY-MM-DD") + "' WHERE `id` = " + this.id )
        }
    }

    delSocket(socketId){
        delete this.sockets[socketId]
    }

    haveSocket(){
        return Object.keys(this.sockets).length > 0
    }

    startResetPassword(){
        var key = global.moment() + "%$" + this.id 
        this.resetPassword = global.cryptoJs.MD5(key).toString(global.cryptoJs.enc.Base64)
        var sql = "UPDATE `user` SET `resetPassword` = '" + this.resetPassword + "' " +
                    " WHERE `id` = " + this.id
        //console.log(sql)
        global.connection.query(sql)
        return this.resetPassword
    }

    changePassword(password){
        this.password = password
        var sql = "UPDATE `user` SET `password` = '" + this.password + "' " +
            " WHERE `id` = " + this.id

        global.connection.query(sql)
    }
}
module.exports=user;
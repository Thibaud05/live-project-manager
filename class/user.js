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
        }
    }

    getFullName()
    {
        return this.firstName + " " + this.lastName
    }

    getKey()
    {
        var key = this.id + "%:#" + this.email + "/$!" + this.password
        global.cryptoJs.MD5(key).toString(global.cryptoJs.enc.Base64)
    }

    saveKey(){
        res.cookie('key', this.getKey() ,{ maxAge: 1000 * 360 * 24 * 365 });
    }
}
module.exports=user;
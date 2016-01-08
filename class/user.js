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
            this.firstname = data.firstname
            this.lastname = data.lastname
            this.lastconnexion = data.lastconnexion
            this.autoconnexion = data.autoconnexion
        }
    }

    getFullName()
    {
        return this.firstname + " " + this.lastname
    }
}
module.exports=user;
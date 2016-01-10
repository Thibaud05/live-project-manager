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
        }
    }

    getFullName()
    {
        return this.firstName + " " + this.lastName
    }
}
module.exports=user;
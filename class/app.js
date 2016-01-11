'use strict'
class app
{
    constructor()
    {
        this.users = []
        this.usersLogged = 0
    }

    login(data)
    {
        var newUser = data
        for (var user of this.users) {
            if( data.email == user.email && data.password == user.password ){
                if( !user.logged ){
                    this.usersLogged ++
                }
                user.logged = true
                newUser = user
            }
        }
        console.log(this.users)
        return newUser
    }

    getNbUserLogged()
    {
        var str = this.usersLogged 
        if(str < 2){
            str += " utilisateur connecté"
        }else{
            str += " utilisateurs connectés"
        }
        return str
    }

}
module.exports=app;
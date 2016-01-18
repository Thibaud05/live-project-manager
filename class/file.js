'use strict'
class file
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.name = data.name;
            this.id_type = data.id_type;
            this.day = data.day;
        }
    }

    getFullName()
    {
        return this.firstName + " " + this.lastName
    }
}
module.exports=file;
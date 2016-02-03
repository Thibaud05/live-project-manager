'use strict'
class file
{
    constructor(data)
    {
        if(data)
        {
            this.id = data.id;
            this.name = data.name;
            this.typeId = data.typeId;
            this.day = data.day;
        }
    }
}
module.exports=file;
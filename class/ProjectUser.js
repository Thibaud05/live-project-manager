class ProjectUser
{
    constructor(data)
    {
        if(data)
        {
            this.id_project = data.id_project;
            this.id_user = data.id_user;
            this.right = data.right;
        }
    }

    isVisibleUser(){
        return (this.right == 1)
    }

}
module.exports = ProjectUser;
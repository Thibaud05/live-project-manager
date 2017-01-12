var project = require("./project.js");
var acUser = require("./ac.js");
//////////////////////////////////////////
//
//  PROJECT SCREEN CLASS
//
//////////////////////////////////////////
class projectScreen{
    constructor(projectsUser,projects,usersById){
        this.nbCol = 3;
        this.AllProject = projects
        this.projectsData = [];
        this.usersById = usersById
        this.mapData(projectsUser);
    }

    dispayMyProject()
    {
        var html = '<div class="container"><div class="starter-template"><h1>Projets';
        html += ' <a id="addUser" href="#" class="btn btn-success" title="Ajouter un projet"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>';
        html += '</h1></div>';
        var nbCol = 0;
        var row = "";
        this.projectsData.forEach(function(p,i) {
            nbCol ++;
            row += '<div class="col-md-4">' + p.display() + '</div>';
            if(nbCol % this.nbCol == 0){
                html += '<div class="row">' + row + '</div>';
                row = "";
            }
        },this);
        if(row != ""){
            html += '<div class="row">' + row + '</div>';
        }
        $("#screenContainer").html('<div class="container">' + html + '</div>');
        var self = this;
        $(".project").click(function(){
            var id = $(this).parents(".card").attr("projectId");
            self.selectFav(id);
        });
        $(".btnFav").click(function(){
            var id = $(this).parents(".card").attr("projectId");
            self.displayDetails(id);
        });
    }

    selectFav(id)
    {
        this.projectsData.forEach(function(p) {
            if(p.id!=id){
                window.tm.unSelectProject(p.id)
            }
        });
        window.tm.selectProject(id)
        window.tm.closeProject()
    }

    displayDetails(id)
    {
        var self = this
        var p = this.projectsData[id];
        $("#screenContainer").html(p.displayDetails());
        $("#addUser").click(function(){
            console.log("click btn add")
            $("#addUser").hide()
            $("#addUser").after('<input type="text" class="form-control" id="acUser" placeholder="User">')
            $("#acUser").focus()
            var myAcUser = new acUser("#acUser",self.usersById);
            myAcUser.init()
        });

    }

    mapData(projectsUser){
        var self = this;
        

        projectsUser.forEach(function(projectId) {
            var p = new project(self.AllProject[projectId]);
            this.projectsData[p.id] = p;
        },this);
    }
}
module.exports = projectScreen;
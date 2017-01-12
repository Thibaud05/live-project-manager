
//////////////////////////////////////////
//
//  PROJECT OBJECT
//
//////////////////////////////////////////
class project{
  constructor(data){
    this.id = data.id;
    this.name = data.name;
    this.desc = data.desc;
    this.img = data.img;
    this.color = data.color
    this.isPublic = data.isPublic;
    this.id_project = data.id_project;
    this.selected = data.selected;
  }

display()
  {
    var html = '<div class="card" projectId="' + this.id + '">';
    html += '<div class="btnFav"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-star';
    if(this.selected){
      html += ' selected';
    }
    html += '" aria-hidden="true"></span></button></div>'; 
    html += '<a href="#" class="project" style="' + this.displayBackground() + '">';
    html += this.displayName();
    html += '</a>';
    html += '</div>'; 
    return html;
  }

  displayDetails()
  {
    var html = '<div class="container-fluid">';
    html += ' <div class="row projectDetailsHeader" style="' + this.displayBackgroundColor() + '">';
    html += '   <div class="col-md-4 col-md-offset-4">';
    html += '     <div class="project" style="' + this.displayBackground() + '">' + this.displayName() + '</div>';
    html += '   </div>';
    html += ' </div>';
    html += ' </div>';
    html += '<div class="container">';
    html += ' <div class="row">';
    html += '   <div class="col-md-6">' + this.displayUsers()
    html += '     <h2>Liens</h2>' + this.displayDocuments()  
    html += '   <div class="col-md-6"><br><img class="img-responsive" src="img/project/visual-pitch.png" /><h2>Description</h2>' + this.desc + '</div>';
    html += ' </div>';
    html += '</div>';
    return html;
  }

  displayUsers()
  {
    var html = '<h2><form class="form-inline">Collaborateurs ';
    html += '<a id="addUser" href="#" class="btn btn-success" title="Ajouter un collaborateur"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>'
    html += '</from></h2>';
    html += '<div class="users row">';
    html += '<div class="user"><div class="avatar"></div><div class="name">User 1</div></div>';
    html += '<div class="user"><div class="avatar"></div><div class="name">User 2</div></div>';
    html += '<div class="user"><div class="avatar"></div><div class="name">User 3</div></div>';
    html += '<div class="user"><div class="avatar"></div><div class="name">User 4</div></div>';
    html += '<div class="user"><div class="avatar"></div><div class="name">User 5</div></div>';
    html += '</div>';
    return html;
  }

  displayBackground()
  {
    var html = '';
    if(this.img != ''){
      html += 'background-image: url(img/project/' + this.img + ');';
    }
    html += this.displayBackgroundColor();
    return html;
  }

  displayBackgroundColor()
  {
    var html = '';
    if(this.color != ''){
      html += 'background-color: ' + this.color + ';';
    }
    return html;
  }

  displayName(){
    var html = '';
    if(this.img == ''){
      html = this.name;
    }
    return html;
  }

  displayDocuments(){
    var html = '<div class="row"></div><div class="list-group col-sm-6">';
    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> Site web</button>';
    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span> Présentation</button>';
    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-film" aria-hidden="true"></span> Vidéo</button>';
    html += '</div>';
    html += '<div class="list-group col-sm-6">';
    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon glyphicon-euro" aria-hidden="true"></span> Tarification </button>';
    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> Documentation</button>';
    html +=   '<button type="button" class="list-group-item"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Formation</button>';
    html += '</div></div>';
    return html;
  }

  select(){
    if(!this.selected){
      this.selected = 1;
      $(".card[projectid=" + this.id + "] .glyphicon-star").addClass("selected"); 
    }
  }

  unSelect(){
    if(this.selected){
      this.selected = 0;
      $(".card[projectid=" + this.id + "] .glyphicon-star").removeClass("selected"); 
    }
  }
}
module.exports = project;
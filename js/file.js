//////////////////////////////////////////
//
//  FILE OBJECT
//
//////////////////////////////////////////
function file(data){
  this.id = data.id;
  this.id_task = data.id_task;
  this.name = data.title;
  this.type = data.type;
  this.fullUrl = tasksManager.fullUrl;
}

file.prototype = {
  buildUrl: function() {
    var baseUrl = this.fullUrl + "/server/files/";
    this.url = baseUrl + this.name;
    this.thumbnailUrl = baseUrl + "thumbnail/" + this.name;
    return true
  },
  display: function(){
    this.buildUrl();
    if (this.url) {
      var thumbnail = this.getThumbnail();
      html = '<div class="file"><a class="content" target="_blank" href="' + this.url + '" >' + thumbnail + '</a>' + this.name + ' <a href="#" fid="' + this.id + '" class="removeFile" >X</a></div>';
    } else if (this.error) {
      html  = '<span class="text-danger">' + this.error + '<br>' + error + '</span>'
    }
    return html;
  },
  getThumbnail: function(){
    var html = ""
    switch(this.type){
      case "image/jpeg" :
        html = '<img src="' + this.thumbnailUrl + '" />';
        break
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
        html = '<img src="' + this.fullUrl + "/img/ico/doc.png" + '" />';
        break
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        html = '<img src="' + this.fullUrl + "/img/ico/ppt.png" + '" />';
        break
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        html = '<img src="' + this.fullUrl + "/img/ico/xls.png" + '" />';
        break
        
      default : 
        html = this.type
    }
    return html
    
  }
}
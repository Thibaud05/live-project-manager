class file{
  constructor(data){
    this.id = data.id;
    this.taskId = data.taskId;
    this.name = data.title;
    this.type = data.type;
    this.fullUrl = "";
  }

  buildUrl() {
    var baseUrl = this.fullUrl + "files/";
    this.url = baseUrl + this.name;
    this.thumbnailUrl = baseUrl + "thumbnail/" + this.name;
    return true
  }

  display(){
    this.buildUrl();
    var html;
    if (this.url) {
      html = '<div class="file"><a class="content" target="_blank" href="' + this.url + '" >' + this.getThumbnail() + '</a>' + this.name + ' <a href="#" fid="' + this.id + '" class="removeFile" >X</a></div>';
    } else if (this.error) {
      html  = '<span class="text-danger">' + this.error + '<br>' + error + '</span>'
    }
    return html;
  }

  getThumbnail(){
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
module.exports = file;
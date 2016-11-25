class link{
  constructor(data){
    this.id = data.id;
    this.taskId = data.taskId;
    this.title = data.title;
    this.url = data.link;
  }

  display(){
    var html = '<div class="link">'
    html += '<a href="' + this.url + '" target="_blank" class="btn btn-link"><span><i class="glyphicon glyphicon-link"></i></span><br></a>';
    html += this.title;
    html += ' | <a href="#" lid="' + this.id + '" class="removeLink" title="Remove link">X</a>D';
    html += '</div>';
    return html 
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
module.exports = link;
class message{
  constructor(data){
    this.txt = data.txt
    this.moment = moment(data.dateTime,"YYYY-MM-DD HH:mm:ss")
    this.user = data.user
    this.me = data.me
  }

  display(){
    var html = ''
    if(this.me){
      html += '<div class="me">'
    }else{
      html += '<div class="other">'
      html += this.user.getAvatar(32)
    }
    html += '  <div class="messageTime">' + this.getTime() + '</div>'
    html += '  <div class="message">'
    if(!this.me){
      html += '   <div class="userName">' + this.user.lastName + '</div>'
    }
    html += '   <div><p>' + this.txt + '</p></div>'
    html += '  </div>'
    html += '</div>'
    return html
  }

  getTime(){
    return this.moment.format("HH:mm")
  }
}
module.exports = message;
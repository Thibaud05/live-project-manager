class message{
  constructor(data){
    this.id = data.id
    this.userId = data.userId
    this.taskId = data.taskId
    this.txt = data.txt
    this.moment = moment(data.moment,"YYYY-MM-DD HH:mm:ss")
    this.user = window.tm.users[data.userId]
    this.me = data.userId == window.tm.connectUserId
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
      html += '   <div class="userName">' + this.user.getName() + '</div>'
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
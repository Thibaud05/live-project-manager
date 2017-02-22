var message = require("./message.js");
class chat{
  constructor(container,messages,taskId){
    this.$container = $(container)
    this.display();
    this.messages = messages;
    this.$messages = $('.messages');
    this.$input = $('.chatInput');
    this.$btnSend = $('#btnSend');
    this.lastHeight = this.$input.height();
    this.totalHeight = this.$container.height();
    this.userId = window.tm.connectUserId;
    this.taskId = taskId;
    this.init();
  }

  display(){
     this.$container.html('<div class="messages"></div>\
        <div class="addMessage">\
          <div class="chatInput" contenteditable="true" placeholder="Entrer un message ici"></div>\
          <button id="btnSend" class="btn btn-default" type="button"><span class="glyphicon \glyphicon-send" aria-hidden="true"></span></button>\
        </div>');
  }

  sendMessage()
  {
    var txt = this.$input.html().replace(/<div>/g, "").replace(/<\/div>/g, "<br>");
    if(txt!=""){
      var data = {
        "userId" : this.userId,
        "moment" : moment(),
        "txt" : txt,
        "taskId" : this.taskId
      }
      console.log("Send chat message")
      socket.emit('setDataMessages', data);
      this.$input.text("")
    }
  }

  checkForChanges()
  {
    if (this.$input.height() != this.lastHeight)
    {
        this.lastHeight = this.$input.height(); 
        var oldMessagesHeight = this.$messages.height()
        var newMessagesHeight = this.totalHeight-this.lastHeight
        this.$container.css("padding-bottom" , (this.lastHeight + 15) + "px")
        this.$messages.scrollTop(this.$messages.scrollTop()- newMessagesHeight +10 + oldMessagesHeight)
    }
  }

  displayLastMessage()
  {
    this.$messages.scrollTop(this.$messages.prop("scrollHeight"));
  }

  displayMessages()
  {
    var html = ""
    var days = {}
    this.messages.map(function(m,key){
      if(days[m.getDay()] == undefined){
        days[m.getDay()] = true
        html += m.dispayDay()
      }
      html += m.display()
    })
    this.$messages.html(html)
  }

  init()
  {
    var self = this

    //this.mapUsers()
    //this.mapMessages()
    this.displayMessages()
    this.displayLastMessage()

    // afficher le chat quand le scroll est fini
    this.$container.css("visibility","visible")

    // Saisie d'une valeur
    this.$input.keyup(function(e){
      self.checkForChanges()
    });

    this.$input.keydown(function(e){
      self.delay(function(e){self.checkForChanges()},10)
    });
    
    // Envoy dun message
    this.$btnSend.click(function(e){
      self.sendMessage()
    });

    // Gestion de la touche entrer
    this.$input.keypress(function(e){
      if(e.which == 13 && !event.shiftKey ) {
          self.sendMessage();
          e.preventDefault();
      }
    });
  }
  delay(callback, ms){
    var timer = 0;
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
}
module.exports = chat;
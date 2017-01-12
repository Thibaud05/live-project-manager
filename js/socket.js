var config = require("./config.js");
var instance = null;
class socket{  
    constructor() {
        if(!instance){
              instance = io.connect(config.host);
        }
        return instance;
      }
}
module.exports = new socket();
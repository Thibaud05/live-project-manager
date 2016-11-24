var config = require("./config.js");
let instance = null;
class socket{  
    constructor() {
        if(!instance){
              instance = io.connect(config.host);;
        }
        return instance;
      }
}
module.exports = new socket();
const fs = require ('fs')
const path = require("path");

class Templates {

  constructor (){
    this.statusContent = new Map();
    this.statusContent.set('running',  fs.readFileSync(path.resolve(__dirname,'./running.md'),"utf8"))
    this.statusContent.set('starting', fs.readFileSync(path.resolve(__dirname,'./starting.md'),"utf8"))
    this.statusContent.set('waiting',  fs.readFileSync(path.resolve(__dirname,'./waiting.md'),"utf8"))
    this.statusContent.set('canceled', fs.readFileSync(path.resolve(__dirname,'./canceled.md'),"utf8"))
    this.statusContent.set('status',   fs.readFileSync(path.resolve(__dirname,'./status.md'),"utf8")
      .replace('${GRAPHANA_URL}',process.env.GRAPHANA_URL))
  }
  get(key) {
    return this.statusContent.get(key);
  }
}

module.exports = new Templates();
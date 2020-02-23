const axios = require('axios')
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie')
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

class SpinnakerAPI {

  constructor (){

  }

  login(access_token) {

    return new Promise((resolve, reject) => {
      if(!access_token){
        access_token = process.env.SPINNAKER_ACCESS_TOKEN
      }
      axios({
        // make a POST request
        method: 'get',
        jar: cookieJar, // tough.CookieJar or boolean
        withCredentials: true,
        // to the Github authentication API, with the client ID, client secret
        // and request token
        url: `https://${process.env.SPINNAKER}/login`,
        // Set the content type header, so that we get the response in JSOn
        headers: {
          Authorization: 'Bearer ' + access_token
        }
      }).then((response) => {
        this.session = cookieJar.store.idx[process.env.SPINNAKER]['/']['SESSION'].value
        resolve(this.session)
      }).catch(err => {
        reject(err)
      });
    });
  }

  async executions(){
    let executions = [];
    let apps = await this.applications()
    for(let i = 0; i<apps.length ; i++) {
      let exec = await this.applicationExecutions(apps[i].name)
      executions.push(exec)
    }
    return executions;
  }

  applications(){
    return this.get(`https://${process.env.SPINNAKER}/applications/`)
  }

  applicationExecutions(application,eventId){
    let params="";
    if(eventId) params= params + `&eventId=${eventId}`
    return this.get(`https://${process.env.SPINNAKER}/applications/${application}/executions/search?triggerTypes=webhook${params}`)
  }

  get(url){
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        headers: {
          cookie: 'SESSION=' + this.session,
          accept: "application/vnd.github.v3.patch",
          "user-agent": "octokit.js/16.13.4 Node.js/10.15.0 (macOS High Sierra; x64)",
        }
      }).then((res) => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
module.exports= new SpinnakerAPI()
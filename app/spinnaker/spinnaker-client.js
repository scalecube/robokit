var req = require('request-promise'); // just this line is changed
const cookieJar = req.jar();
class SpinnakerAPI {

  constructor (){

  }

  login(access_token){
    if(!access_token){
      access_token = process.env.SPINNAKER_ACCESS_TOKEN
    }
    return req ({
        // make a POST request
        method: 'GET',
        jar: cookieJar, // tough.CookieJar or boolean
        // to the Github authentication API, with the client ID, client secret
        // and request token
        url: `https://${process.env.SPINNAKER}/login`,
        // Set the content type header, so that we get the response in JSOn
        headers: {
          Authorization: 'Bearer ' + access_token
        },
        json: true
    }).then((response) => {
      this.session = cookieJar._jar.store.idx[process.env.SPINNAKER]['/']['SESSION'].value
      return {
        auth: true,
        session: this.session
      }
    }).catch(err => {
      console.error(err)
    })
  }

  get(url) {
    return req({
        uri: url,
        method: "GET",
        jar: cookieJar,
        json: true
       }
      );
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

}
module.exports= new SpinnakerAPI()
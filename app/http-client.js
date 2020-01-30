const rp = require('request-promise');

class HttpClient {
  post (uri, msg) {
    return rp({
      method: 'POST',
      uri: uri,
      body: msg,
      json: true // Automatically stringifies the body to JSON
    })
  };

  get (uri) {
    return rp({
      method: 'GET',
      uri: uri,
      json: true // Automatically stringifies the body to JSON
    })
  };
}

module.exports = new HttpClient()

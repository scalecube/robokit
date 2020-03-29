const axios = require('axios')
// GET request for remote imag
class Stream {
  static from (url) {
    return {
      on: (callback) => {
        axios({
          method: 'get',
          url: url,
          responseType: 'stream'
        }).then((response) => {
          response.data.on('data', (chunk) => {
            callback(chunk.toString())
          })
          response.data.on('end', (chunk) => {
            callback('EOF')
          })
        }).catch((err) => {
          console.error(err)
        })
      }
    }
  }
}

module.exports = Stream

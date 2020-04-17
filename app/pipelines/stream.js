const axios = require('axios')
// GET request for remote imag
class Stream {
  static from (url) {
    return {
      on: (data, end) => {
        axios({
          method: 'get',
          url: url,
          responseType: 'stream'
        }).then((response) => {
          response.data.on('data', (chunk) => {
            data(chunk.toString())
          })
          response.data.on('end', (chunk) => {
            end()
          })
        }).catch((err) => {
          console.error(err)
        })
      }
    }
  }
}

module.exports = Stream

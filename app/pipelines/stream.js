const axios = require('axios')
const readline = require('readline')
var http = require('http')

// GET request for remote imag
class Stream {
  static from (url) {
    return {
      on: (data, end) => {
        http.get(url, (response) => {
          readline.createInterface({
            input: response
          }).on('line', data).on('close', end)
        })
      }
    }
  }
}

module.exports = Stream

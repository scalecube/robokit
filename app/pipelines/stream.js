const readline = require('readline')
var http = require('http')
var https = require('https')

function provider (url) {
  if (!url.startsWith('https')) {
    return http
  } else {
    return https
  }
}
// GET request for remote imag
class Stream {
  static from (url) {
    const protocol = provider(url)
    return {
      on: (data, end) => {
        protocol.get(url, (response) => {
          readline.createInterface({
            input: response
          }).on('line', data).on('close', end)
        })
      }
    }
  }
}

module.exports = Stream

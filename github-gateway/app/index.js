require('dotenv').config()

if (!process.env.GITHUB_TOKEN) console.log('required GITHUB_TOKEN enviroment variable is missing')
if (!process.env.GITHUB_SECRET) console.log('required GITHUB_SECRET enviroment variable is missing')
if (!process.env.PUBLIC_API_PORT) console.log('required GITHUB_API_PORT enviroment variable is missing')
if (!process.env.INTERNAL_API_PORT) console.log('required STATUS_API_PORT enviroment variable is missing')
if (!process.env.MONGO_DB_CONNECTION_STRING) console.log('required MONGO_DB_CONNECTION_STRING enviroment variable is missing')

/**
 * @param {string} str
 * @param {string} maskChar
 * @param {number} unmaskedLength
 * @param {boolean} [maskFromStart]
 * @returns {string}
 */
function mask (str, maskChar, unmaskedLength, maskFromStart = true) {
  const maskStart = maskFromStart ? 0 : Math.max(0, unmaskedLength)
  const maskEnd = maskFromStart ? Math.max(0, str.length - unmaskedLength) : str.length
  return str
    .split('')
    .map((char, index) => {
      if (index >= maskStart && index < maskEnd) {
        return maskChar
      } else {
        return char
      }
    })
    .join('')
}

console.log('GITHUB_TOKEN: ' + mask(process.env.GITHUB_TOKEN, '*', 16))
console.log('GITHUB_SECRET: ' + process.env.GITHUB_SECRET)
console.log('PUBLIC_API_PORT: ' + process.env.PUBLIC_API_PORT)
console.log('INTERNAL_API_PORT: ' + process.env.INTERNAL_API_PORT)
console.log('MONGO_DB_CONNECTION_STRING: ' + process.env.MONGO_DB_CONNECTION_STRING)

const gateway = require('./http-gateway')

const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: 'https://smee.io/f74sOaXacyxBsDQs',
  target: 'http://localhost:3000',
  logger: console
})

const events = smee.start()

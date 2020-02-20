const MongoClient = require('mongodb').MongoClient

class Repository {
  constructor (dbName) {
    new Promise((resolve, reject) => {
      this.uri = process.env.MONGO_DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/admin'
      this.dbName = dbName
      this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    })
    return this
  }

  async count () {
    if (this.collection) {
      return await this.collection.countDocuments()
    } else {
      return 0
    }
  }

  connect (collectionName) {
    return new Promise((resolve, reject) => {
      this.client.connect(err => {
        this.dbo = this.client.db(this.dbName)
        this.collection = this.dbo.collection(collectionName)
        if (!this.collection) {
          console.log('creating ' + collectionName + ' collection')
          this.dbo.createCollection(collectionName, (err, res) => {
            if (err) reject(err)
            this.collection = this.dbo.collection(collectionName)
            this.collection.createIndex({ sha: 1 }, { unique: false })
            console.log(collectionName + ' was Collection created!')
            resolve(this)
          })
        } else {
          this.collection = this.dbo.collection(collectionName)
          resolve(this)
        }
      })
    })
  }

  insert (data) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(data, (err, result) => {
        if (err) reject(err)
        data._id = result.insertedId
        resolve(data)
      })
    })
  }

  findOldest () {
    return this.collection.findOne({},
      { sort: { _id: 1 } })
  }

  delete (oid) {
    return new Promise((resolve, reject) => {
      this.collection.deleteOne({ _id: oid })
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = Repository

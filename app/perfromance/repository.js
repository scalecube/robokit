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

  connected(){
    return this.collection != undefined
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

  insert (sha, data) {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now()
      if (Array.isArray(data)) {
        const many = []

        data.forEach(item =>
          many.push({
            sha: sha,
            timestamp: timestamp,
            data: item
          })
        )

        this.collection.insertMany(many, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      } else {
        this.collection.insertOne({
          sha: sha,
          timestamp: timestamp,
          data: data
        }, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }
    })
  }

  templates (template) {
    return new Promise((resolve, reject) => {
      if(this.collection) {
        let query = {}
        if(template) query = { templateId : template }
        this.collection.find(query).toArray(function (err, result) {
          if (err) reject(err)
          resolve(result)
        })
      } else {
        resolve([])
      }
    })
  }

  find (sha, where) {
    return new Promise((resolve, reject) => {

      let query = { sha: sha }

      if (where && where instanceof Object) {
        query = where
        query.sha = sha
      }
      if(this.collection) {
        this.collection.find(query).toArray(function (err, result) {
          if (err) reject(err)
          resolve(result)
        })
      } else {
        resolve([])
      }

    })
  }

  map(array) {
    let a = new Map()
    array.map(x => {
    if(!a.get(x.sha)) {
      a.set(x.sha,new Date(x._id.getTimestamp()).toISOString())
    }})
    return a
  };

  distinct (field) {
    return new Promise((resolve,reject) =>{
      this.collection.find({},{sha:-1}).project({ sha: 1, _id: 1 }).sort( { _id: -1 } ).toArray((err, result) => {
        if (err) reject(err)
        let reduce = this.map(result)
        resolve(reduce)
      })
    })
  }

  listDatabases() {
    console.log(this.dbo.listDatabases(true));
  }
}

module.exports = Repository

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

  connected () {
    return this.collection !== undefined
  }

  connect (collectionName) {
    return new Promise((resolve, reject) => {
      this.client.connect(async err => {
        this.dbo = this.client.db(this.dbName)
        const collections = await this.dbo.collections()
        if (!collections.map(c => c.s.namespace.collection).includes(collectionName)) {
          console.log('creating ' + collectionName + ' collection')
          this.dbo.createCollection(collectionName, (err, res) => {
            if (err) reject(err)
            this.collection = this.dbo.collection(collectionName)
            this.collection.createIndex({ name: 1 }, { unique: true })
            console.log(collectionName + ' was Collection created!')
          })
        }
        this.collection = this.dbo.collection(collectionName)
        resolve(this)
      })
    })
  }

  /*
     env:
      - name: NAMESPACE
      - name: OWNER
   */

  environment (env) {
    const envName = `${env.OWNER}/${env.NAMESPACE}`
    return new Promise((resolve, reject) => {
      this.collection.findOne({ name: envName })
        .then(r => {
          if (r) {
            const envRes = r
            delete envRes._id
            delete envRes.name
            resolve(envRes)
          } else {
            this.collection.aggregate([
              { $sort: { ENV_ID: -1 } },
              { $limit: 1 }])
              .toArray().then(count => {
                const nextCount = count + 1
                this.collection.insertOne({
                  _id: nextCount,
                  name: envName,
                  ENV_ID: nextCount,
                  OWNER: env.OWNER,
                  NAMESPACE: env.NAMESPACE
                }).then(r => {
                  if (r.result.ok && r.ops.length > 0) {
                    const envRes = r.ops[0]
                    delete envRes._id
                    delete envRes.name
                    resolve(envRes)
                  }
                }).catch(e => {
                  reject(e)
                })
              })
          }
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

module.exports = Repository

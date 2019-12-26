const MongoClient = require('mongodb').MongoClient;

class Repository {

    constructor(dbName) {
        new Promise((resolve, reject) => {
            this.uri = process.env.MONGO_DB_CONNECTION_STRING;
            this.dbName = dbName;
            this.client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true});
        });
        return this;
    }

    connect(collectionName) {
        return new Promise((resolve,reject)=>{
            this.client.connect(err => {
                this.dbo = this.client.db(this.dbName);
                this.collection = this.dbo.collection(collectionName);
                if (!this.collection) {
                    console.log("creating " + collectionName + " collection");
                    this.dbo.createCollection(collectionName, (err, res) => {
                        if (err) reject(err);
                        this.collection = this.dbo.collection(collectionName);
                        this.collection.createIndex({sha: 1},{ unique: false });
                        console.log(collectionName + " was Collection created!");
                        resolve(this);
                    });
                } else {
                    this.collection = this.dbo.collection(collectionName);
                    resolve(this);
                }
            });
        });
    }

    insert (sha, data) {
        return new Promise((resolve, reject) => {
            const timestamp = Date.now();
            if(Array.isArray(data)){
                const many = [];

                data.forEach( item =>
                    many.push( {
                        sha : sha ,
                        timestamp: timestamp ,
                        data: item
                    })
                );

                this.collection.insertMany(many, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } else {
                this.collection.insertOne({
                    sha : sha ,
                    timestamp: timestamp,
                    data: data
                }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            }
        });
    }

    find(sha, where) {
        return new Promise((resolve, reject) => {
            let query ={ sha: sha };

            if(where && where instanceof Object){
                query = where;
                query.sha = sha;
            }
            this.collection.find(query).toArray(function(err, result) {
                if (err) reject(err);
                resolve(result);
            }).sort({'_id': -1});
        });
    }

    distinct(field) {
        return new Promise((resolve, reject) => {
          resolve(this.collection.distinct(field));
        });
    }
}

module.exports = Repository;
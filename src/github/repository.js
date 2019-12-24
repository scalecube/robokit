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

    insert (data) {
        return new Promise((resolve, reject) => {
            this.collection.insertOne(data, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.collection.find().toArray(function(err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Repository;
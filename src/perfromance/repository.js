const MongoClient = require('mongodb').MongoClient;

class Repository {

    constructor() {
        new Promise((resolve, reject)=>{
            this.uri = process.env.MONGO_DB_CONNECTION_STRING;
            this.dbName = process.env.MONGO_DB_DATABASE_NAME;
            this.client = new MongoClient(this.uri, { useNewUrlParser: true , useUnifiedTopology: true});
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
                        this.collection.createIndex({cid: 1})
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
    insert (cid, data) {
        return new Promise((resolve, reject) => {
            if(Array.isArray(data)){
                const many = [];
                data.forEach( item =>
                    many.push( { cid : cid , data: item  })
                );

                this.collection.insertMany(many, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } else {
                this.collection.insertOne({
                    cid : cid ,
                    data: data
                }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            }
        });
    }

    find(cid, where) {
        return new Promise((resolve, reject) => {
            let query ={ cid: cid };

            if(where && where instanceof Object){
                query = where;
                query.cid = cid;
            }
            this.collection.find(query).toArray(function(err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    distinct(field) {
        this.collection(field);
    }
}

module.exports = Repository;
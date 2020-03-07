const Repository = require('./repository.js')

class PerformanceService {
  constructor () {
    this.repo = new Map()
  }

  getOrCreate (owner, repoName) {
    const key = owner + '/' + repoName
    return new Promise((resolve, reject) => {
      if (!this.repo.has(key)) {
        this.repo.set(key, new Repository(owner))
        this.repo.get(key).connect(repoName).then(rep => {
          resolve(this.repo.get(key))
        })
      } else {
        if(!this.repo.get(key).connected()){
          this.repo.get(key).connect(repoName).then(r=>{
            resolve(this.repo.get(key))
          })
        } else{
          resolve(this.repo.get(key))
        }
      }
    })
  };

  getTemplates (template) {
    return new Promise((resolve, reject) => {
      this.getOrCreate(process.env.MONGO_DB_COLLECTION, "templates").then(repo => {
          resolve(repo.templates(template))
      })
    })
  }

  createTemplate (owner, repo, name, data) {
    return new Promise((resolve, reject) => {
      this.getOrCreate('scalecube', process.env.MONGO_DB_COLLECTION).then(repo => {
        resolve(repo.insert(name, data))
      })
    })
  }

  addReport (owner, repoName, sha, data) {
    return new Promise((resolve, reject) => {
      this.getOrCreate(owner, repoName).then(repo => {
        resolve(repo.insert(sha, data))
      })
    })
  };

  findReport (owner, repoName, sha, filter) {
    return new Promise((resolve, reject) => {
      this.getOrCreate(owner, repoName).then(repo => {
        resolve(repo.find(sha, filter))
      })
    })
  }

  listCommits (owner, repoName) {
    return new Promise((resolve, reject) => {
      if(owner && repoName){
        this.getOrCreate(owner, repoName).then(repo => {
          let x = repo.distinct('sha')
          resolve(x)
        })
      } else {
        reject(new Error())
      }
    })
  }
};

module.exports = new PerformanceService()

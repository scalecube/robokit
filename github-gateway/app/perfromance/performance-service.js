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
        resolve(this.repo.get(key))
      }
    })
  };

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
      this.getOrCreate(owner, repoName).then(repo => {
        resolve(repo.distinct('sha'))
      })
    })
  }
};

module.exports = new PerformanceService()

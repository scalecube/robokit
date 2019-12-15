const Repository = require('./repository.js');

class PerformanceService {

    constructor(){
        this.repo = new Repository();
    };

    connect() {
        return this.repo.connect("performance");
    }

    addReport(cid, data) {
        return this.repo.insert(cid, data);
    };

    findReport(cid, filter) {
        return this.repo.find(cid,filter);
    }

    listCommits(cid){
        return this.repo.find(cid);
    }
};

module.exports = new PerformanceService();
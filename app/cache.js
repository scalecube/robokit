const contexts = new Map();

class Cache {
    set(owner,repo, ctx) {
        contexts.set(owner+ "/" + repo, ctx);
    }

    get(owner,repo) {
        return contexts.get(owner+ "/" + repo);
    }
}

module.exports = Cache;
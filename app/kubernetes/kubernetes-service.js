const k8s = require('@kubernetes/client-node');

class Kubernetes {
  constructor (){
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
  }

  async namespaces(){
    let res = await this.k8sApi.listNamespace()
    return res.body.items.map((item) => {
      return {
        namespace: item.metadata.name,
        status: item.status.phase,
        uid: item.metadata.uid
      }
    });
  }
}

module.exports = new Kubernetes()

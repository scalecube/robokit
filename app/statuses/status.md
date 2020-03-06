## Robokit Continues Delivery

<img align="left" width="180" src="https://tinyurl.com/rootojr">

${progress}

:black_circle: Details:

[Grafana](https://grafana.genesis.om2.com/explore?orgId=1&left=%5B%22now%2Fy%22,%22now%22,%22loki%22,%7B%22expr%22:%22%7Bnamespace%3D%5C%22${namespace}%5C%22%7D%22%7D,%7B%22mode%22:%22Logs%22%7D,%7B%22ui%22:%5Btrue,true,true,%22none%22%5D%7D%5D)

```
Namespace: ${namespace}
branch: ${branch_name}
sha: ${sha}
duration ${duration}

Pipeline stages:
```diff
> (Trigger) robo-kit pipeline queued.
> (Trigger) robo-kit deployment pipeline was triggered successfully  
${details}
```
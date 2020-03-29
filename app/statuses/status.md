## ${progress} 

${owner}/${repo}@${sha}

<img width="100" src="https://tinyurl.com/rootojr">
 <a href="${GRAPHANA_URL}/explore?orgId=1&left=%5B%22now%2Fy%22,%22now%22,%22loki%22,%7B%22expr%22:%22%7Bnamespace%3D%5C%22${namespace}%5C%22%7D%22%7D,%7B%22mode%22:%22Logs%22%7D,%7B%22ui%22:%5Btrue,true,true,%22none%22%5D%7D%5D">
 <img width="22"  src="https://user-images.githubusercontent.com/1706296/76145481-638e8e00-6092-11ea-8918-80722d29ab88.png">Logs and Monitoring</img>
</a>
</img>

---

```
user: ${user}
namespace: ${namespace}
branch: ${branch_name}
sha: ${sha}
duration: ${duration}
```

Pipeline stages:
---

```diff
> (Trigger) robo-kit pipeline queued.
> (Trigger) robo-kit deployment pipeline was triggered successfully  
${log_details}
```


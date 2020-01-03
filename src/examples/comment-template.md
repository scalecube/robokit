# This is a comment Template

when sending a createComment request and passing parameters in the json request at run-time these values will be replaced with the content of the given values

```json
{
  "owner":"scalecube",
  "repo":"github-gateway",
  "issue_number":1,
  
  "a-param":"some value",
  
  "path":"src/examples/comment-template.md",
  "url":"https://raw.githubusercontent.com/scalecube/github-gateway/test1/src/examples/comment-template.md",
  "data":"comment data example ${a-param}"
}
```

here is example a-param value: ${a-param} 


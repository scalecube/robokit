# This is a comment Template

when sending a createComment request and passing parameters in the json request at run-time these values will be replaced with the content of the given values

```json
{
  "owner":"scalecube",
  "repo":robokit,
  "issue_number":1,
  
  "a-param":"some value",
  
  "path":"src/examples/comment-template.md",
  "url":robokit,
  "data":"comment data example ${a-param}"
}

```
here is example a-param value: ${a-param} 


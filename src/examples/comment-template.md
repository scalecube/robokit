#This is a comment Template

when sending a createComment request and passing parameters in the json request at run-time these values will be replaced with the content of the given values

```
{
  "owner": "scalecube",
  "repo": "status-checks",
  "issue_number": 1,
  "body": "greetings ${owner} ppl of ${repo}",
  "a-param": "some value"
}
```

here is example a-param value: ${a-param} 


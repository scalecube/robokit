const http = require("http");
const cors = require('cors');

const express = require('express');

const github = require("./github/github-service");
const performanceService = require('./perfromance/performance-service');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.INTERNAL_API_PORT;
///////////////////////////////////////////////////////////////////////////////////////
//
//  HTTP Gateway API
//
///////////////////////////////////////////////////////////////////////////////////////
app.get('/ping/', (request, response) => {
    console.log("ping request arrived from:");
    response.send({time: Date.now()});
});

app.post('/pulls/status/update', (request, response) => {
    sendResponse(response, github.update(request.body));
});

app.post('/comment/update', (request, response) => {
    thenResponse(github.updateComment(request.body),response);
});

app.post('/comment/create', (request, response) => {
    thenResponse(github.createComment(request.body),response);
});

app.get('/traces/get/:owner/:repo/:sha', (request, response) => {
    performanceService.findReport(request.params.owner,
        request.params.repo,
        request.params.sha).then(r=>{
        let result = [];
        r.forEach(e => { result.push(e.data); });
        response.send(result);
    });
});

app.get('/traces/get/:owner/:repo/:sha/:filter', (request, response) => {
    performanceService.findReport(request.params.owner,
        request.params.repo,
        request.params.sha,
        JSON.parse( request.params.filter)).then(r=>{
        let result = [];
        r.forEach(e => { result.push(e.data); });
        response.send(result);
    });
});

app.get('/commit/list/:owner/:repo/', (request, response) => {
    thenResponse(performanceService.listCommits(
        request.params.owner,
        request.params.repo),response);
});


app.post('/traces/add', (request, response) => {
    thenResponse(performanceService.addReport(request.body.owner,
        request.body.repo,
        request.body.sha,
        request.body.traces),
        response);
});

app.post('/webhooks/create', (request, response) => {
    thenResponse(github.createWebhook(request.body),response);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('process.env.INTERNAL_API_PORT - something bad happened', err)
    }
    console.log(`process.env.INTERNAL_API_PORT - server is listening on ${port}`)
});

///////////////////////////////////////////////////////////////////////////////////////
//
//  Github Gateway API
//
///////////////////////////////////////////////////////////////////////////////////////

httpHandler = (request, response,next) => {
    if(request.url.startsWith("/traces/get/")) {
        let owner = request.url.split("/")[3];
        let repo = request.url.split("/")[4];
        let sha = request.url.split("/")[5];
        performanceService.findReport(owner,repo,sha).then(r => {
            let result = [];
            r.forEach(e => {
                result.push(e.data);
            });
            writeResponse(result,response);
        });
    } else if(request.url.startsWith("/commit/list")) {
        let owner = request.url.split("/")[3];
        let repo = request.url.split("/")[4];
        performanceService.listCommits(owner,repo).then((r)=>{
            writeResponse(r,response);
        }).catch((err)=>{
            console.log(err);
        });
    } else {
        return github.webhooks.middleware(request,response,next);
    }
};

if (process.env.NODE_ENV !== "test") {
    http.createServer(httpHandler)
        .listen(process.env.PUBLIC_API_PORT);
    console.log("process.env.PUBLIC_API_PORT - Listening on port: " + process.env.PUBLIC_API_PORT);
}

writeResponse = (data,response) =>{
    response.write(JSON.stringify(data));
    response.end();
};

const thenResponse = (p, response) => {
    p.then((r)=>{
        response.send(r);
    }).catch((err)=>{
        console.error(err);
        response.status(500);
        response.send(err);
    });
};

const sendResponse = (response , result) => {
    if(result === 'ok') {
        response.send(result);
    } else {
        response.status(500);
        response.send("PR URL is wrong/ not found or not waiting for update.");
    }
};


const github = require("./github/github-service");
const http = require("http");

var cors = require('cors');
const performanceService = require('./perfromance/performance-service');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

const rp = require('request-promise');
doPost = (msg) => {
    return rp({
        method: 'POST', uri: process.env.YOUR_SERVER_URL,
        body: msg,
        json: true // Automatically stringifies the body to JSON
    });
};

const port = process.env.STATUS_API_PORT;
///////////////////////////////////////////////////////////////////////////////////////
//
//  HTTP Gateway API
//
///////////////////////////////////////////////////////////////////////////////////////
app.post('/pulls/status/update', (request, response) => {
    sendResponse(response, github.update(request.body));
});

app.post('/comment/update', (request, response) => {
    thenResponse(github.updateComment(request.body),response);
});

app.post('/comment/create', (request, response) => {
    thenResponse(github.createComment(request.body),response);
});

app.get('/traces/get/:cid', (request, response) => {
    performanceService.findReport(request.params.cid).then(r=>{
        let result = [];
        r.forEach(e => { result.push(e.data); });
        response.send(result);
    });
});

app.get('/traces/get/:cid/:filter', (request, response) => {
    performanceService.findReport(request.params.cid, JSON.parse( request.params.filter)).then(r=>{
        let result = [];
        r.forEach(e => { result.push(e.data); });
        response.send(result);
    });
});

app.post('/traces/add', (request, response) => {
    thenResponse(performanceService.addReport(request.body.cid, request.body.traces),response);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('process.env.STATUS_API_PORT - something bad happened', err)
    }
    console.log(`process.env.STATUS_API_PORT - server is listening on ${port}`)
});


httpHandler = (request, response,next) => {

    if(request.url.startsWith("/traces/get/")) {
        performanceService.findReport(request.url.replace("/traces/get/")).then(r=>{
            let result = [];
            r.forEach(e => { result.push(e.data); });
            response.send(result);
        });
    }else{
        return github.webhooks.middleware(request,response,next);
    }
};

if (process.env.NODE_ENV !== "test") {
    http.createServer(httpHandler)
        .listen(process.env.GITHUB_API_PORT);
    console.log("process.env.GITHUB_API_PORT - Listening on port: " + process.env.GITHUB_API_PORT);
};

doPost = (msg) => {
    return rp({
        method: 'POST', uri: process.env.YOUR_SERVER_URL,
        body: msg,
        json: true // Automatically stringifies the body to JSON
    });
};

init = () => {
    performanceService.connect().then((r)=>{});
};
init();

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



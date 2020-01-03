require("dotenv").config();

if(!process.env.GITHUB_TOKEN) console.log("required GITHUB_TOKEN enviroment variable is missing" );
if(!process.env.GITHUB_SECRET) console.log("required GITHUB_SECRET enviroment variable is missing" );
if(!process.env.PUBLIC_API_PORT) console.log("required GITHUB_API_PORT enviroment variable is missing" );
if(!process.env.INTERNAL_API_PORT) console.log("required STATUS_API_PORT enviroment variable is missing" );
if(!process.env.MONGO_DB_CONNECTION_STRING) console.log("required MONGO_DB_CONNECTION_STRING enviroment variable is missing" );

console.log("GITHUB_TOKEN: " + process.env.GITHUB_TOKEN);
console.log("GITHUB_SECRET: " + process.env.GITHUB_SECRET);
console.log("PUBLIC_API_PORT: " + process.env.PUBLIC_API_PORT);
console.log("INTERNAL_API_PORT: " + process.env.INTERNAL_API_PORT);
console.log("MONGO_DB_CONNECTION_STRING: " + process.env.MONGO_DB_CONNECTION_STRING);

const gateway = require("./http-gateway");

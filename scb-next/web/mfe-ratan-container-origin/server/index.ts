import express from "express";
const app = express()
import compression from "compression";
import { nohttp, health } from "./server_util/header";
const DIST_DIR = __dirname;

app.use(compression())
app.use(express.json({
    limit: process.env.FILE_LIMIT || '1mb'
}))
app.use(express.urlencoded({
    limit: process.env.FILE_LIMIT || '1mb'
}))
app.use(nohttp)
app.use(express.static(DIST_DIR));
app.get('/health', health);
app.get('/index.js', health);
app.get('/server_util', health);

const port = process.env.PORT || 8009
const server = app.listen(port, () => {
    console.log(`server started. PORT: ${port} `);
})
server.timeout = parseInt(process.env.DEFAULT_TIMEOUT || "30000");
server.on('error', (error: any) => {
    if (error?.code === 'EADDRINUSE') {
        process.exit(1);
    }
});
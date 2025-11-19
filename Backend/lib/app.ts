import bodyParser from 'body-parser';
import compression from "compression";
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import http, { createServer } from 'http';
import roleController from './controllers/role.controller';
import router from './routes/router';
import msg91Service from './services/msg91.service';
dotenv.config();

const app: Express = express();
const httpServer: http.Server = createServer(app);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors());
app.use(compression());
app.use(router);
const port: number = parseInt(process.env.PORT || '8080');

httpServer.listen(port, async function () {
    console.log(`current time ${new Date().toLocaleTimeString('en-IN')}`);
    console.log(`Stallion backend listening at http://127.0.0.1:${port}`);
    msg91Service.initialize();
    await roleController.createDefaultRoles();
});

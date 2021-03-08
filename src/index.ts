import express, { Application,Request, Response } from 'express';
import { urlencoded,json } from 'body-parser';

import apiV1 from './routes/v1';


const port = 5000;
const app:Application = express();
app.use(urlencoded({ extended: false}));
app.use(json());

apiV1(app);

app.use(( req:Request, res:Response )=>{
    res.status(404).send('Not Found')
});

app.listen(port,() => {
    console.log('running on ',port,' port')
});


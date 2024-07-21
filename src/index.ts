import express, { Express, Request, Response } from 'express';
import 'dotenv/config';

const app: Express = express();
const port = process.env.PORT || 3000;

const userRouter = require('./routes/user');

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`[Server]: Server is running at http://localhost:${port}`);
});

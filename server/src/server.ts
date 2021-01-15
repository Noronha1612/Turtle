import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

import routes from './routes';

config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const port = 3333;
const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
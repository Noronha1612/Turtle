import app from './app';
import { config } from 'dotenv';

config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

app.listen(process.env.PORT || 3333);
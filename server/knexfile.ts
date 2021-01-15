import { config } from 'dotenv';
import path from 'path';

config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export default {
  client: "postgresql",
  connection: process.env.DB_URL,
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  }
};

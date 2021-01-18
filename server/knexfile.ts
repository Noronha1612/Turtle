import path from 'path';
import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export default {
  test: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '__tests__', 'database.sqlite')
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true
  },

  development: {
    client: 'postgres',
    connection: process.env.DB_URL,
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

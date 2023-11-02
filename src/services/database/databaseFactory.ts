import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

class DatabaseFactory {
  client: DataSource;

  constructor() {
    const options: DataSourceOptions = {
      type: 'postgres',
      host: process.env.PGHOST ?? 'localhost',
      port: parseInt(process.env.PGPORT ?? '5432'),
      database: process.env.PGDATABASE ?? 'employee',
      username: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD ?? '',
      entities: [__dirname + '/entities/*{.js,.ts}'],
    };

    this.client = new DataSource(options);
  }
  async connect() {
    await this.client
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });

    await this.client.synchronize();
  }

  async disconnect() {
    this.client.destroy();
  }
}

export default new DatabaseFactory();

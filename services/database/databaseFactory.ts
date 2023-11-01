import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabase } from 'typeorm-extension';

class DatabaseFactory {
  client: DataSource;

  async connect() {
    const options: DataSourceOptions = {
      type: 'postgres',
      host: process.env.PGHOST ?? 'localhost',
      port: parseInt(process.env.PGPORT ?? '5432'),
      database: process.env.PGDATABASE ?? 'employee',
      username: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD ?? '',
      entities: ['entities/*.ts'],
    };

    await createDatabase({
      options,
      ifNotExist: true,
    });

    this.client = new DataSource(options);

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

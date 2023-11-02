import { APIServer } from './server';
import databaseFactory from './services/database/databaseFactory';

const server = new APIServer();
databaseFactory
  .connect()
  .then(() => console.log(`Database connected`))
  .catch(console.error)
  .then(() =>
    server.server.listen(
      {
        port: Number.parseInt(process.env.PORT || '8080'),
        host: process.env.HOST || 'localhost',
      },
      (err, address) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log(`Server listening at ${address}`);
      }
    )
  );

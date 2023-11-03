# User AYA TEST TASK

## Quick start

1. Clone this repo using:
  
  ```shell
  git clone git@github.com:basi1iscus/aya-test-task.git
  ```

2. To install dependencies and clean the git repo run:

  ```shell
  npm install
  ```
3. Copy .env.example file to .env in project folder and make the necessary changes there

4. Build project

  ```shell
  npm run build
  ```
5. Run project

  ```shell
  npm start
  ```

#### Docker
Server working on 8080 ports on localhost

To run
```shell
docker-compose -f ./docker-compose.yml up
```
To stop
```shell
docker-compose -f ./docker-compose.yml down
```

## API

```Shell
GET /api/v1/remuneration - get remuneration


POST /api/v1/loaddump - load dump file
```
Also You can use Aya_test_task.postman_collection.json for postman

## Questions

Objective: demonstrate that the design desicions you made were solid by
answering the questions.

>1. How to change the code to support different file versions?
>I use Factory Metod pattern and interface IDumpParser

If we have different a file version, we must create a new class that implements interface IDumpParser and returns IParserDTO object and add it to the map in the factory class like this:
  
  ```Shell
  private static parserMap: Record<string, Class> = {
    v1: DumpParser,
    v2: DumpParserV2,
  };
  ```
>2. How the import system will change if data on exchange rates disappears from
>   the file, and it will need to be received asynchronously (via API)?

   We'll create a service that gets exchange rates via API and then we can:
     - call it from DumpParser and return the exchange rates with employees in IParserDTO as they are now
     - call it outside DumpParser and puts the rates in constructor ParserDTO as a parameter
     - create a cron service that gets exchange rates and write it down in the database in order to be used when they are needed

>3. In the future the client may want to import files via the web interface,
>   how can the system be modified to allow this?

   We can modify this.server.post('/api/v1/loaddump') endpoint or create a new endoint that can accept the file with dump in the request body and the controller will send it to dump loader 

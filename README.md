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

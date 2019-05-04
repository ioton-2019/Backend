# NodeJS server API

## Install
Install [NodeJS](https://nodejs.org/en/)
and [MongoDB](https://www.mongodb.com)

Then run `npm i`

Copy example credentials with `cp .env.example .env`
and edit these.

#### Optional
To import test data start `mongod` and fill it with `mongoimport --db <DB_NAME> --collection <DB_COLLECTION> --type json --file <TESTDATA>.json --jsonArray`

##### Lamps
`mongoimport --db IoThon --collection Lamps --type json --file testData/lamps.json --jsonArray`

## Run
`npm run start`


## Documentations
Logging: [Winston](https://github.com/winstonjs/winston)  
Environment variables: [dotenv](https://github.com/motdotla/dotenv)  
MongoDB object modeling: [mongoose](https://mongoosejs.com/)  
Express framework: [express](https://expressjs.com/de/4x/api.html)

## Linter
[standardJS](https://standardjs.com/)

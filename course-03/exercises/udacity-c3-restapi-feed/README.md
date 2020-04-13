# Udagram Image Backend Feed Microservice

This is the feed microservice for the Udagram application. The feed microservice provides the Rest APIs for creating posts, fetching feed etc.

The [The Simple Frontend](../udacity-c3-frontend) web application consumes these APIs for the user to be able to user in the browser

## Getting Setup

> _tip_: this frontend is designed to work with the RestAPI backends). It is recommended you deploy the backend first, test using Postman, and then the start the frontend application to access the application in a browser.

### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of each application's repository. After cloning, open your terminal and run:
```bash
npm install
```
inside each application to get all its projects and developer dependencies.

>_tip_: **npm i** is shorthand for **npm install**

### Setup Backend Node Environment
1. From the `udacity-c3-restapi-feed` directory run `npm install` and then start up the project
1. You will need to configure the environment variables defined inside the `./src/config/config.ts in your user profile before running the application
1. by default the feed microservice runs on port 6002. This can also be configured through an environment variable to run on a port defined by the `PORT` variable.
1. ensure the correct port is used in the frontend application for accessing these APIs.
1. Ideally we want to run all microservices on the same port defined by the `PORT` variable so that the nginx server can proxy them all correctly through a docker container

### Configuring the environment variables:
You need to configure the following environment variabled and have them sourced in the terminal you will be building and running the application
```bash
export UDAGRAM_USERNAME=<database-username>
export UDAGRAM_PASSWORD=<database-password>
export UDAGRAM_DATABASE=<database-name>
export UDAGRAM_DATABASE_HOST=<AWS-RDS-database-host-path>
export UDAGRAM_S3_BUCKET=<AWS-S3-bucket-name>
export AWS_PROFILE=default
export JWT_SECRET=<a-random-secret-to-be-used-for-JWT>
export UDAGRAM_URL=<Access-Control-URL-on-the-backend>

# You may use a different port, but ensure you update all the
# necessary files in the deployment module accordingly
export PORT=6003
```

### Deploy independently

To deploy just the user service independently run 
```bash
npm run dev
```
from the module root.

***

### Accessing the microservice
Access the feed microservice application on `http://localhost:6003`

***

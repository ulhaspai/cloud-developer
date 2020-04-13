# Udagram Image Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](./udacity-c3-frontend) A basic Ionic client web application which consumes the RestAPI Backend. 
1. [The RestAPI Feed Backend](./udacity-c3-restapi-feed), a Node-Express feed microservice.
1. [The RestAPI User Backend](./udacity-c3-restapi-user), a Node-Express user microservice.

## Getting Setup

> _tip_: this frontend is designed to work with the RestAPI backends). It is recommended you deploy the backend first, test using Postman, and then the start the frontend application to access the application in a browser.

### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

### Installing Ionic Cli
The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI can be found in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli).

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of each application's repository. After cloning, open your terminal and run:
```bash
npm install
```
inside each application to get all its projects and developer dependencies.

>_tip_: **npm i** is shorthand for **npm install**

### Setup Backend Node Environment
1. Go the `udacity-c3-restapi-feed` directory and run `npm install` and then start up the project
1. You will need to configure the environment variable defined inside the `src/config/config.ts` file accordingly
1. Go the `udacity-c3-restapi-user` directory and run `npm install` and then start up the project
1. You will need to configure the environment variable defined inside the `src/config/config.ts` file accordingly

### Configure The Backend Endpoint
Ionic uses environment files located in `/src/enviornments/enviornment.*.ts` to load configuration variables at runtime. By default `environment.ts` is used for development and `enviornment.prod.ts` is used for production. The `apiHost` variable should be set to your server url either locally or in the cloud.

### Configuring the environment variables:
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

***
### Running the Development Server
Ionic CLI provides an easy to use development server to run and autoreload the frontend. This allows you to make quick changes and see them in real time in your browser. To run the development server, open terminal and run:

```bash
ionic serve
```

### Building the Static Frontend Files
Ionic CLI can build the frontend into static HTML/CSS/JavaScript files. These files can be uploaded to a host to be consumed by users on the web. Build artifacts are located in `./www`. To build from source, open terminal and run:
```bash
ionic build
```
***

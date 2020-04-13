# Udagram Image Backend Feed Microservice

This is the user microservice for the Udagram application. The user microservice provides the Rest APIs creating new users and user authentication.

The [The Simple Frontend](../udacity-c3-frontend) web application consumes these APIs for the user to be able to use these APIs in the browser.

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
1. From the `udacity-c3-restapi-user` directory run `npm install` and then start up the project
1. You will need to configure the environment variables defined inside the `./src/config/config.ts in your user profile before running the application
1. By default the user microservice runs on port 6001. This can also be configured through an environment variable to run on a port defined by the `PORT` variable.
1. Ensure the correct port is used in the frontend application for accessing these APIs.
1. Ideally we want to run all microservices on the same port defined by the `PORT` variable so that the nginx server can proxy them all correctly through a docker container

***

# Udagram Image Microservice

### Set up environment variables

You will need to set up the following environment variable to be able to run these docker images correctly:

```bash
export UDAGRAM_USERNAME=<AWS-RDS-POSTGRES-DATABASE-USERNAME>
export UDAGRAM_PASSWORD=<AWS-RDS-POSTGRES-DATABASE-PASSWORD>
export UDAGRAM_DATABASE=<AWS-RDS-POSTGRES-DATABASE-NAME>
export UDAGRAM_DATABASE_HOST=<AWS-RDS-HOST>
export UDAGRAM_S3_BUCKET=<S3-BUCKET-NAME>
export AWS_PROFILE=default
export JWT_SECRET=<random-string>
export UDAGRAM_URL=http://localhost:8100
export PORT=6003
```
### Docker images
Pull the docker images from the docker hub public repo:

```bash
docker pull ulhaspai/udacity-c3-restapi-feed
docker pull ulhaspai/udacity-c3-restapi-user
docker pull ulhaspai/udacity-c3-frontend
docker pull ulhaspai/reverseproxy
```

### Setup Docker Environment
You'll need to install docker https://docs.docker.com/install/. Open a new terminal within the project directory and run:

1. Build the images: `docker-compose -f docker-compose-build.yaml build --parallel`
2. Push the images: `docker-compose -f docker-compose-build.yaml push`
3. Run the container: `docker-compose up`


### Set up your own images

You will need to update the docker-compose.yaml and docker-compose-build.yaml files and the Dockerfile inside each module to reflect the correct image names if you want to create and run your own images

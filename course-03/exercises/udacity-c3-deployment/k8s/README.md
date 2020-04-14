## Setting up a Kubernetes cluster on AWS using Kubeone

## Configuring deployment files
1. Update [./backend-feed-deployment.yaml](./backend-feed-deployment.yaml) to use the correct docker image
1. Update [./backend-user-deployment.yaml](./backend-user-deployment.yaml) to use the correct docker image
1. Update [./reverseproxy-deployment.yaml](./reverseproxy-deployment.yaml) to use the correct docker image
1. Update [./frontend-deployment.yaml](./frontend-deployment.yaml) to use the correct docker image

## Setting up config maps and secrets
1. Update the [./env-configmap.yaml](./env-configmap.yaml) file with the correct values for each environment variable defined in that file
1. Update the [./env-secret.yaml](./env-secret.yaml) file with a base64 encoded value for each environment variable defined in that file
1. Update the [./aws-secret.yaml](./aws-secret.yaml) file with the base64 encoded value for the aws credentials file
 

## Kubernetes on AWS using Kubeone
1. Follow the instruction on this page [Setting up ssh](https://github.com/kubermatic/kubeone/blob/master/docs/ssh.md) to get your ssh configuration right for later use.
You may skip this step and perform an optional step described in the steps below instead

1. Follow the instructions on this page [Kubernetes on AWS using Kubeone](https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md)
to get your local environment working with kops, kubectl and KubeOne.

### Brief gist
A brief gist of the commands to run from the [AWS folder](./aws):

```bash
# export your AWS credentials by adding them to your ~/.profile file 
# and then sourcing it or restart your terminal
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
source ~/.profile

# initialize your terraform cluster
terraform init

# create a terraform plan for the cluster
# give your cluster a name when requested (e.g. udacity-c3-microservices)
terraform plan -out "plan" 

# apply the terraform plan to the AWS cluster to initialize your EC2 instances and supporting configurations in AWS 
terraform apply "plan"

# the previous step will generate a file with the name "terraform.tfstate" in your current folder
# add your ssh private key path to terraform.tfstate file
# Follow this step here: https://github.com/kubermatic/kubeone/blob/master/docs/ssh.md#option2-terraform-output
# if you set up your ssh-agent, you might not need to do this step.

# generate kubeone config.yaml file
# if you want to use the file in the github repo as is, then skip this step 
kubeone config print --full > config.yaml

# edit the config.yaml file from above and update the cluster name in the file
# if you named your cluster udacity-c3-microservice skip this step

# install kubernetes using kubeone config and terraform output
kubeone install config.yaml --tfjson . --verbose

# the previous command should generate <cluster-name>-kubeconfig file
export KUBECONFIG=$PWD/<cluster_name>-kubeconfig

```
### ConfigMaps and Secrets
Update the following files to reflect the correct values for your configmaps and secrets:
- AWS secrets in [./aws-secret.yaml](./aws-secret.yaml) file
- Environment variables in [./env-configmap.yaml](./env-configmap.yaml) file
- Secrets in [./env-secret.yaml](./env-secret.yaml) file


### Apply configurations

```bash
kubectl apply -f ../aws-secret.yaml
kubectl apply -f ../env-configmap.yaml
kubectl apply -f ../env-secret.yaml

kubectl apply -f ../backend-feed-deployment.yaml
kubectl apply -f ../backend-feed-service.yaml

kubectl apply -f ../backend-user-deployment.yaml
kubectl apply -f ../backend-user-service.yaml

kubectl apply -f ../frontend-deployment.yaml
kubectl apply -f ../frontend-service.yaml

kubectl apply -f ../reverseproxy-deployment.yaml
kubectl apply -f ../reverseproxy-service.yaml
```

### Upgrades / Rolling Restarts

Rolling restarts are easy in kubernetes. You can run the following commands to rollin update your deployments:

```bash
# rolling restart all deployments in parallel at the same time 
kubectl rollout restart deployments

# rolling restart a specific deployment only
 kubectl rollout restart deployment/<deployment-name>

```

### Port forwarding

Once all deployments and services are up you can perform port forwarding to validate your application to run correctly:
 
```bash
# port forward frontend service to access locally
kubectl port-forward service/frontend 8100:80

# port forward reverseproxy to access locally
kubectl port-forward service/reverseproxy 6003:8080
```

### Clean up AWS infrastructure

It is recommended that you clean up your AWS resources when not in use to avoid incurring high usage costs. You the following commands to do the clean up.
   
```bash
# When you are done clean up your machine deployments
kubeone reset config.yaml --tfjson . --verbose

# destroy your terraform AWS infrastructure
terraform destroy
```

These commands should clean up all resources cleanly, however if you need to verify, log into your AWS account to verify that all running instances are terminated.

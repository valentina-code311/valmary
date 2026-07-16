#!/bin/bash
set -e

Choice() {
  MESSAGE=$1
  read -p "$MESSAGE (y/N) " -r
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    $2
  fi
}

SetUpGlobal() {
  gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    compute.googleapis.com \
    firebase.googleapis.com \
    firestore.googleapis.com \
    storage.googleapis.com

  gcloud artifacts repositories create $BASE_NAME \
    --repository-format=docker \
    --location=$REGION
}

SetupSA() {
  gcloud iam service-accounts create $BASE_NAME-backend \
    --display-name $BASE_NAME-backend \
    --description "SA for service $BASE_NAME-backend"

  gcloud iam service-accounts create $BASE_NAME-frontend \
    --display-name $BASE_NAME-frontend \
    --description "SA for service $BASE_NAME-frontend"

  gcloud iam service-accounts create $BASE_NAME-cicd \
    --display-name $BASE_NAME-cicd \
    --description "SA for service $BASE_NAME-cicd"
}

SetupPermissions() {
  SA_EMAIL=$BASE_NAME-backend@$PROJECT.iam.gserviceaccount.com
  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/run.jobsExecutor \
    --condition None

  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/firebase.admin \
    --condition None

  SA_EMAIL=$BASE_NAME-cicd@$PROJECT.iam.gserviceaccount.com
  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/artifactregistry.writer \
    --condition None

  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/run.developer \
    --condition None

  gcloud projects add-iam-policy-binding $PROJECT \
    --member serviceAccount:$SA_EMAIL \
    --role roles/iam.serviceAccountUser \
    --condition None
}

SetupJson() {
  gcloud iam service-accounts keys create \
    conn/gcp.json \
    --iam-account=$BASE_NAME-backend@$PROJECT.iam.gserviceaccount.com

  gcloud iam service-accounts keys create \
    conn/gcp_cicd.json \
    --iam-account=$BASE_NAME-cicd@$PROJECT.iam.gserviceaccount.com
}

SetupVariablesGitlab() {
  BODY=$(cat conn/gcp_cicd.json)
  glab variable set GCP_CREDENTIALS_JSON "$BODY" -p

  ACCOUNT=$BASE_NAME-cicd@$PROJECT.iam.gserviceaccount.com
  BODY=$(cat conn/.env | sed "s|ACCOUNT=.*|ACCOUNT=$ACCOUNT|")
  glab variable set ENV_FILE "$BODY" -p

  BODY=$(cat conn/backend.env | sed "s|BASE_NAME=.*|BASE_NAME=$BASE_NAME|")
  glab variable set BACKEND_ENV_FILE "$BODY" -p

  PROJECT_NUMBER=$(gcloud projects list --filter="projectId:$PROJECT" --format="value(projectNumber)")
  VITE_API_URL="https://$BASE_NAME-backend-$PROJECT_NUMBER.$REGION.run.app"
  BODY=$(cat conn/frontend.env | sed "s|VITE_API_URL=.*|VITE_API_URL=$VITE_API_URL|" | sed "s|BASE_NAME=.*|BASE_NAME=$BASE_NAME|")
  glab variable set FRONTEND_ENV_FILE "$BODY" -p
}

SetupVariablesGithub() {
  REPOSITORY=$(gh repo view --json nameWithOwner -q '.nameWithOwner')

  BODY=$(cat conn/gcp_cicd.json)
  gh secret set GCP_CREDENTIALS_JSON -R "$REPOSITORY" -b "$BODY"

  ACCOUNT=$BASE_NAME-cicd@$PROJECT.iam.gserviceaccount.com
  BODY=$(cat conn/.env | sed "s|ACCOUNT=.*|ACCOUNT=$ACCOUNT|")
  gh variable set ENV_FILE -R "$REPOSITORY" -b "$BODY"

  BODY=$(cat conn/backend.env | sed "s|BASE_NAME=.*|BASE_NAME=$BASE_NAME|")
  gh variable set BACKEND_ENV_FILE -R "$REPOSITORY" -b "$BODY"

  PROJECT_NUMBER=$(gcloud projects list --filter="projectId:$PROJECT" --format="value(projectNumber)")
  VITE_API_URL="https://$BASE_NAME-backend-$PROJECT_NUMBER.$REGION.run.app"
  BODY=$(cat conn/frontend.env | sed "s|VITE_API_URL=.*|VITE_API_URL=$VITE_API_URL|" | sed "s|BASE_NAME=.*|BASE_NAME=$BASE_NAME|")
  gh variable set FRONTEND_ENV_FILE -R "$REPOSITORY" -b "$BODY"
}

touch ./conn/.env && . ./conn/.env

if [ -z "$BASE_NAME" ]; then
  read -p "BASE_NAME: " BASE_NAME
  echo "BASE_NAME=$BASE_NAME" >> conn/.env
fi
. ./scripts/gcp_login.sh
. ./conn/.env

Choice "Set up global?" SetUpGlobal
Choice "Set up SA?" SetupSA
Choice "Set up permissions?" SetupPermissions
Choice "Set up json?" SetupJson
Choice "Set up variables github?" SetupVariablesGithub
Choice "Set up variables gitlab?" SetupVariablesGitlab

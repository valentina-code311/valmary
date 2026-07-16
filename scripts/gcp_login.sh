#!/bin/bash
env_file="./conn/.env"
mkdir -p conn
touch $env_file
. $env_file

if [ -z "$ACCOUNT" ]; then
  read -p "GCP account: " ACCOUNT
  echo "ACCOUNT=$ACCOUNT" >> $env_file
fi
if [ -z "$PROJECT" ]; then
  read -p "GCP project: " PROJECT
  echo "PROJECT=$PROJECT" >> $env_file
fi
if [ -z "$REGION" ]; then
  read -p "GCP region: " REGION
  echo "REGION=$REGION" >> $env_file
fi

gcloud config set account $ACCOUNT
gcloud config set project $PROJECT
gcloud config set compute/region $REGION

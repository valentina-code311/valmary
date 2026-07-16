#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

Usage() {
  echo "Usage: $0 [OPTIONS] [-t TOOL]"
  echo
  echo "Parameters:"
  echo "  TOOL       Tool to install (aws, gcloud, az, docker, jq, unzip)"
  echo
  echo "Example:"
  echo "  $0 -t gcloud"
  echo "  $0 -t aws -t jq"
}

DockerInstall() {
  apt-get update
  apt-get install -y ca-certificates curl gnupg lsb-release
  DISTRO=$(lsb_release -is | tr '[:upper:]' '[:lower:]')
  curl -fsSL https://download.docker.com/linux/$DISTRO/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/$DISTRO $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io
}

AWSInstall() {
  apt-get install -y unzip
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  ./aws/install
}

AzureInstall() {
  apt-get update
  apt-get install -y ca-certificates curl apt-transport-https lsb-release gnupg
  curl -sL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.gpg > /dev/null
  AZ_REPO=$(lsb_release -cs)
  echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | tee /etc/apt/sources.list.d/azure-cli.list
  apt-get update
  apt-get install -y azure-cli
}

JQInstall() {
  apt-get update
  apt-get install -y jq
}

GcloudInstall() {
  apt-get update
  curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
  apt-get update && apt-get install google-cloud-cli -y
}

InstallTools() {
  for tool in $TOOLS; do
    echo " - Installing $tool"
    case $tool in
      unzip ) command unzip || apt install unzip ;;
      jq ) command -v jq || JQInstall ;;
      docker ) command -v docker || DockerInstall ;;
      aws ) command -v aws || AWSInstall ;;
      az ) command -v az || AzureInstall ;;
      gcloud ) command -v gcloud || GcloudInstall ;;
      * ) echo '[Invalid tool]'; Usage; exit 1 ;;
    esac
  done
}

TOOLS=""
while getopts "t:h" opt; do
  case ${opt} in
    t ) TOOLS="$TOOLS $OPTARG" ;;
    h ) Usage; exit 0 ;;
    \? ) echo '[Invalid parameter]'; Usage; exit 1 ;;
  esac
done

if [ -z "$TOOLS" ]; then
  echo "No tools provided."
  Usage
  exit 1
fi

InstallTools

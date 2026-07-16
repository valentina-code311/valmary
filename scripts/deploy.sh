#!/bin/bash
set -e

Usage() {
  echo "Usage: ./deploy.sh [back|front|all]"
  exit 1
}

DeployImage() {
  sh ./scripts/gcp_login.sh
  gcloud auth configure-docker $REGION-docker.pkg.dev
  docker push $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE:latest
}

DeployFrontend() {
  BUILD_ARGS=""
  while IFS='=' read -r KEY VALUE; do
    ESCAPED_VALUE=$(echo "$VALUE" | sed 's/"/\\"/g')
    BUILD_ARGS="$BUILD_ARGS --build-arg $KEY='$ESCAPED_VALUE'"
  done < "conn/$SERVICE.env"

  eval docker build \
    -f ./docker/$SERVICE.Dockerfile \
    $BUILD_ARGS \
    -t $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE:latest \
    app/frontend/

  DeployImage

  gcloud run deploy \
    $BASE_NAME-$SERVICE \
    --project $PROJECT \
    --image $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE \
    --platform managed \
    --region $REGION \
    --port 80 \
    --timeout 3600 \
    --allow-unauthenticated \
    --service-account $BASE_NAME-$SERVICE@$PROJECT.iam.gserviceaccount.com
}

DeployBackend() {
  docker build \
    -f ./docker/$SERVICE.Dockerfile \
    -t $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE:latest \
    app/backend/

  DeployImage

  sed 's|=|: |' conn/$SERVICE.env > conn/$SERVICE.yaml
  echo "DEPLOYMENT_VERSION: $(date +%Y.%m.%d.%H.%M)" >> conn/$SERVICE.yaml

  gcloud run deploy \
    $BASE_NAME-$SERVICE \
    --project $PROJECT \
    --image $REGION-docker.pkg.dev/$PROJECT/$BASE_NAME/$SERVICE \
    --platform managed \
    --region $REGION \
    --port 80 \
    --timeout 3600 \
    --env-vars-file conn/$SERVICE.yaml \
    --allow-unauthenticated \
    --service-account $BASE_NAME-$SERVICE@$PROJECT.iam.gserviceaccount.com

  rm conn/$SERVICE.yaml
}

. ./conn/.env

if [ "$1" = "back" ]; then
  SERVICE=backend
  DeployBackend
elif [ "$1" = "front" ]; then
  SERVICE=frontend
  DeployFrontend
elif [ "$1" = "all" ]; then
  SERVICE=backend
  DeployBackend
  SERVICE=frontend
  DeployFrontend
else
  Usage
fi

docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/cpnv-es-bi-ria-project/ria2-transform:latest \
  --push .
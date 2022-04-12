## Development

```
skaffold --profile development dev
```

## Production

```
skaffold --profile production --default-repo=registry.hub.docker.com/donalonzo build --push
skaffold --profile production --default-repo=registry.hub.docker.com/donalonzo render
```

```
cp ~/.docker/config.json .
kubectl create secret generic skaffold-cfg --from-file=config.json
kubectl label secret skaffold-cfg skaffold-kaniko=skaffold-kaniko
```

## Construir la imagen

Para construir la imagen correspondiente al último release en `master`.

Dentro de este directorio `docker`: 

```bash
docker build -t buses-api . 
docker tag buses-api:latest labexp/buses-api:latest
docker push labexp/buses-api:latest 
```


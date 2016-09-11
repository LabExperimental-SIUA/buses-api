# buses API engine-js

Implementación en `node.js` del API de backend para el servicio de datos abiertos sobre transporte público

## Requisitos

* `node.js` versión `v0.12.9` : https://nodesource.com/blog/chris-lea-joins-forces-with-nodesource/
* `orientdb` versión `2.1.7` o mayor
* `docker` versión `1.9.1`
* `docker-compose` versión `1.6.2`

## Configuración del ambiente de desarrollo

Se asume que los siguientes comandos se están ejecutando desde el directorio del proyecto `./buses-api`

* Descargar las dependencias

```
npm install
```

* Levantar el servicio de base de datos

```
docker-compose up
```

* Crear la base de datos vacía y el usuario de la aplicación iniciando el engine por primera vez

```
bin/www
```

* Inicializar el esquema en la base de datos recién creada

```
node_modules/orientjs/bin/orientjs migrate up
```

## Recursos

### `POST http://localhost:3000/buses/v0.1/route`

```
POST http://localhost:3000/buses/v0.1/route
```

* Request

```json
{
    "id": "420",
    "stops": [
         {
             "name": "Heredia",
             "location": {
                 "latitude": 9.894389,
                 "longitude": -81.38932
             }
         },
         {
             "name": "San José",
             "location": {
                 "latitude": 9.43843,
                 "longitude": -84.43784
             }
         }
    ],
    "path": [
        {
            "latitude": 9.894389,
            "longitude": -81.38932
        },
        {
            "latitude": 9.32832,
            "longitude": -81.38232
        },
        {
            "latitude": 10.4384,
            "longitude": -84.438943
        },
        {
            "latitude": 9.43843,
            "longitude": -84.43784
        }
    ]
}
```

* Response

```json
{
  "route": "421"
}
```

### `GET http://localhost:3000/buses/v0.1/route/id/{id}`

* Request

```
GET http://localhost:3000/buses/v0.1/route/id/420
```

* Response

```json
{
  "id": "420",
  "stops": [
    {
      "location": {
        "latitude": 9.894389,
        "longitude": -81.38932
      },
      "name": "Heredia",
      "routes": [
        "420",
        "400",
        "410"
      ],
      "createdOn": "2016-01-17T04:19:59.000Z",
      "lastUpdatedOn": "2016-01-17T04:19:59.000Z"
    },
    {
      "location": {
        "latitude": 9.43843,
        "longitude": -84.43784
      },
      "name": "San José",
      "routes": [
        "420",
        "415",
        "400"
      ],
      "createdOn": "2016-01-17T04:19:59.000Z",
      "lastUpdatedOn": "2016-01-17T04:19:59.000Z"
    }
  ],
  "path": [
    {
      "latitude": 9.894389,
      "longitude": -81.38932
    },
    {
      "latitude": 9.32832,
      "longitude": -81.38232
    },
    {
      "latitude": 10.4384,
      "longitude": -84.438943
    },
    {
      "latitude": 9.43843,
      "longitude": -84.43784
    }
  ]
}
```

### `GET http://localhost:3000/buses/v0.1/route/ids`

* Request

```
GET http://localhost:3000/buses/v0.1/route/ids
```

* Response

```json
[
  "400",
  "410",
  "415",
  "420",
  "421"
]
```

# API Trazador Buses

## Iniciar una traza

#### Request

```
POST /buses/v0.1/trace
```

```json
{
    "deviceId": "...",
    "timestamp": "UTC timestamp string"
}
```

La propiedad `deviceId` debe corresponder a algún valor que identifique de manera única al dispositivo con respecto a la aplicación trazador. Ver http://android-developers.blogspot.com/2011/03/identifying-app-installations.html

#### Response
 
HTTP 200 OK

```json
{
    "traceId": "..."
}
```

Cualquier otro código HTTP en caso de error.

## Asociar una lista de puntos con una traza

#### Request

```
POST /buses/v0.1/trace/{traceId}/points
```

```json
{
    "deviceId": "...",
    "timestamp": "UTC timestamp string",
    "points": [
        {
            "latitude": "...",
            "longitude": "..."
        },
        {
            "latitude": "...",
            "longitude": "..."
        },
        {
            "latitude": "...",
            "longitude": "..."
        },
        {
            "latitude": "...",
            "longitude": "..."
        }
    ]
}
```

#### Response
 
HTTP 200 OK

Cualquier otro código HTTP en caso de error.

## Asociar una parada con una traza

#### Request

```
POST /buses/v0.1/trace/{traceId}/stop
```

```json
{
    "deviceId": "...",
    "timestamp": "UTC timestamp string",
    "stop": {
                "latitude": ...,
                "longitude": ...
            }
}
```

#### Response
 
HTTP 200 OK

Cualquier otro código HTTP en caso de error.

## Metadatos de una traza

Para escribir los metadatos:

#### Request
```
PUT /buses/v0.1/trace/{traceId}/metadata
```

```json
{
    "deviceId": "...",
    "timestamp": "UTC timestamp string",
    "routeCode": "400",
    "routeName": "Heredia - San José por La Uruca",
    "routePrice": 560.0
}
```

#### Response
 
HTTP 200 OK

Cualquier otro código HTTP en caso de error.

Para el folksonomy necesita leer todos los metadatos existentes:

#### Request

```
GET /buses/v0.1/trace/metadata
```

#### Response
 
HTTP 200 OK

```json
[
    {
        "traceId": "...",
        "deviceId": "...",
        "timestamp": "UTC timestamp string",
        "routeCode": "400",
        "routeName": "Heredia - San José por La Uruca",
        "routePrice": 560.0
    },
    {
        "traceId": "...",
        "deviceId": "...",
        "timestamp": "UTC timestamp string",
        "routeCode": "420",
        "routeName": "Los Lagos de Heredia - San José por La Uruca",
        "routePrice": 480.0
    },
    ...
]
```

Cualquier otro código HTTP en caso de error.

## Finalizar o descartar una traza

#### Request

```
PUT /buses/v0.1/trace/{traceId}
```

Para finalizar una ruta:

```json
{
    "status": "finished"
}
```

Para descartar una ruta:

```json
{
    "status": "discarded"
}
```

#### Response

HTTP 200 OK

Cualquier otro código HTTP en caso de error.

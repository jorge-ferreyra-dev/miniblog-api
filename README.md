# MiniBlog API

API REST para gestionar autores y publicaciones de un miniblog. Permite realizar operaciones CRUD sobre ambos recursos y relacionar cada publicación con su autor.

Desarrollada con Node.js, Express y PostgreSQL, y desplegada en Railway.

## Demo en producción

- **[Probar la API desde Swagger UI](https://miniblog-api-production-a2d801da.up.railway.app/api-docs)**

- **[API REST desplegada en Railway](https://miniblog-api-production-a2d801da.up.railway.app/)**

La API permite consultar y probar sus endpoints directamente desde Swagger UI, sin necesidad de instalar el proyecto localmente.

Los endpoints utilizan las rutas `/authors` y `/posts` (sin prefijo `/api`).

## Tecnologías

- **Backend:** Node.js 22 y Express

- **Base de datos:** PostgreSQL

- **Cliente de base de datos:** pg (node-postgres)

- **Pruebas:** Vitest y Supertest

- **Documentación:** OpenAPI 3.0 y Swagger UI

- **Despliegue:** Railway

## Arquitectura y estructura del proyecto

La aplicación separa las responsabilidades en rutas, servicios, validadores y middlewares. Las rutas gestionan las solicitudes y respuestas HTTP; los servicios encapsulan las consultas SQL parametrizadas mediante el pool de PostgreSQL; los validadores comprueban los datos de entrada y los middlewares gestionan las rutas inexistentes y los errores globales.

Principales archivos y carpetas:

```text
miniblog-api/
├── app.js
├── db/
│   ├── config.js
│   ├── setup.sql
│   └── seed.sql
├── routes/
│   ├── authors.js
│   └── posts.js
├── services/
│   ├── authors.service.js
│   └── posts.service.js
├── validators/
│   ├── authors.validator.js
│   ├── posts.validator.js
│   └── common.validator.js
├── middlewares/
│   ├── error.middleware.js
│   └── notFound.middleware.js
├── tests/
│   ├── app.test.js
│   ├── authors.test.js
│   ├── posts.test.js
│   ├── authors.validator.test.js
│   ├── posts.validator.test.js
│   └── common.validator.test.js
├── .env.example
├── .gitignore
├── openapi.yaml
├── package.json
├── README.md
└── DOCUMENTACION-IA.md
```

`app.js` es el único punto de entrada de la aplicación. Configura Express, Swagger, las rutas y los middlewares. Mediante `require.main === module`, inicia el servidor únicamente cuando se ejecuta directamente, permitiendo importar la aplicación desde Supertest sin iniciar un servidor independiente.

## Endpoints

### Autores

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Publicaciones

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/posts` | Obtener todas las publicaciones |
| GET | `/posts/:id` | Obtener una publicación por ID |
| GET | `/posts/author/:author_id` | Obtener las publicaciones de un autor |
| POST | `/posts` | Crear una publicación |
| PUT | `/posts/:id` | Actualizar una publicación |
| DELETE | `/posts/:id` | Eliminar una publicación |

## Ejemplos de uso

Los siguientes comandos están pensados para Bash o Git Bash. Las respuestas son ejemplos: los IDs, las fechas y los datos pueden variar. Las operaciones de escritura modifican la base de datos de demostración en Railway.

### Obtener todos los autores

```bash
curl https://miniblog-api-production-a2d801da.up.railway.app/authors
```

**Respuesta de ejemplo (**`**200 OK**`**):**

```json
[
  {
    "id": 1,
    "name": "Ana García",
    "email": "ana@example.com",
    "bio": "Desarrolladora full-stack apasionada por Node.js",
    "created_at": "2026-11-21T16:55:18.088Z"
  },
  {
    "id": 2,
    "name": "Carlos Ruiz",
    "email": "carlos@example.com",
    "bio": "Escritor técnico especializado en bases de datos",
    "created_at": "2026-11-21T16:55:18.088Z"
  },
  {
    "id": 3,
    "name": "María Lopez",
    "email": "maria@example.com",
    "bio": "Ingeniera de software con foco en APIs REST",
    "created_at": "2026-11-21T16:55:18.088Z"
  }
]
```

### Obtener un autor por ID

```bash
curl https://miniblog-api-production-a2d801da.up.railway.app/authors/1
```

**Respuesta de ejemplo (**`**200 OK**`**):**

```json
{
  "id": 1,
  "name": "Ana García",
  "email": "ana@example.com",
  "bio": "Desarrolladora full-stack apasionada por Node.js",
  "created_at": "2026-11-21T16:55:18.088Z"
}
```

### Crear un autor

```bash
curl -i -X POST https://miniblog-api-production-a2d801da.up.railway.app/authors \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "María Rodríguez",
    "email": "maria.rodriguez.ejemplo@example.com",
    "bio": "Ingeniera de software especializada en APIs"
  }'
```

**Respuesta de ejemplo (**`**201 Created**`**):**

```json
{
  "id": 4,
  "name": "María Rodríguez",
  "email": "maria.rodriguez.ejemplo@example.com",
  "bio": "Ingeniera de software especializada en APIs",
  "created_at": "2026-11-23T15:20:56.035Z"
}
```

Si el correo ya está registrado, la API devuelve `409 Conflict`. Para repetir el ejemplo de creación, utilizá un correo distinto.

### Actualizar un autor

El método `PUT` requiere enviar `name` y `email`, aunque solo se desee cambiar la biografía. Reemplazá el ID por el de un autor existente.

```bash
curl -i -X PUT https://miniblog-api-production-a2d801da.up.railway.app/authors/4 \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "María Rodríguez",
    "email": "maria.rodriguez.ejemplo@example.com",
    "bio": "Ingeniera de software y speaker internacional"
  }'
```

**Respuesta de ejemplo (**`**200 OK**`**):**

```json
{
  "id": 4,
  "name": "María Rodríguez",
  "email": "maria.rodriguez.ejemplo@example.com",
  "bio": "Ingeniera de software y speaker internacional",
  "created_at": "2026-11-23T15:20:56.035Z"
}
```

### Eliminar un autor

Reemplazá el ID por el de un autor de prueba sin publicaciones asociadas.

```bash
curl -i -X DELETE https://miniblog-api-production-a2d801da.up.railway.app/authors/4
```

**Respuesta exitosa:** `204 No Content`. No se devuelve un cuerpo JSON.

### Crear una publicación

```bash
curl -i -X POST https://miniblog-api-production-a2d801da.up.railway.app/posts \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Introducción a PostgreSQL",
    "content": "PostgreSQL es una base de datos relacional de código abierto...",
    "author_id": 1,
    "published": true
  }'
```

**Respuesta de ejemplo (**`**201 Created**`**):**

```json
{
  "id": 6,
  "author_id": 1,
  "title": "Introducción a PostgreSQL",
  "content": "PostgreSQL es una base de datos relacional de código abierto...",
  "published": true,
  "created_at": "2026-11-23T16:41:17.073Z"
}
```

El valor de `author_id` debe corresponder a un autor existente.

### Obtener publicaciones de un autor

```bash
curl https://miniblog-api-production-a2d801da.up.railway.app/posts/author/1
```

**Respuesta de ejemplo (**`**200 OK**`**):**

```json
[
  {
    "id": 1,
    "author_id": 1,
    "title": "Introducción a Node.js",
    "content": "Node.js es un runtime de JavaScript...",
    "published": true,
    "created_at": "2026-11-21T16:55:18.366Z",
    "author_name": "Ana García",
    "author_email": "ana@example.com"
  }
]
```

Para consultar y probar los demás endpoints, utilizá Swagger UI.

## Documentación con Swagger UI

**Swagger en producción:** https://miniblog-api-production-a2d801da.up.railway.app/api-docs

La especificación de la API se encuentra en `openapi.yaml`. Swagger UI permite consultar rutas, parámetros, esquemas y probar solicitudes desde el navegador.

Para acceder localmente, iniciá el servidor:

```bash
npm run dev
```

Abrí http://localhost:3000/api-docs.

## Ejecutar localmente

### Prerrequisitos

- Node.js 22 (versión utilizada en el proyecto)

- PostgreSQL 14 o superior

- Git

### Pasos

1. Clonar el repositorio e ingresar a la carpeta:

   ```bash
   git clone https://github.com/jorge-ferreyra-dev/miniblog-api.git
   cd miniblog-api
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=miniblog_db
   ```

   No subas el archivo `.env` con credenciales reales al repositorio.

4. Crear la base de datos y ejecutar los scripts desde la raíz del proyecto:

   ```bash
   psql -U postgres -c "CREATE DATABASE miniblog_db;"
   psql -U tu_usuario -d miniblog_db -f db/setup.sql
   psql -U tu_usuario -d miniblog_db -f db/seed.sql
   ```

   Usá un usuario con permisos suficientes para crear las tablas. Si utilizás un usuario distinto de `postgres`, asegurate de que tenga acceso a `miniblog_db`.

5. Iniciar el servidor:

   ```bash
   npm run dev
   ```

La API estará disponible en http://localhost:3000.

`npm run dev` ejecuta `app.js` en modo watch y carga las variables del archivo `.env`. El comando `npm start` ejecuta `node app.js` y utiliza las variables de entorno disponibles en el proceso, como las proporcionadas por Railway.

## Pruebas automatizadas

El proyecto utiliza Vitest para las pruebas unitarias y Vitest junto con Supertest para las pruebas de integración con Express y PostgreSQL real.

La última ejecución local confirmada obtuvo **82 tests aprobados**: 67 unitarios y 15 de integración.

| Archivo | Tipo | Tests |
| --- | --- | ---: |
| `common.validator.test.js` | Unitario | 10 |
| `authors.validator.test.js` | Unitario | 30 |
| `posts.validator.test.js` | Unitario | 27 |
| `app.test.js` | Integración | 3 |
| `authors.test.js` | Integración | 8 |
| `posts.test.js` | Integración | 4 |
| **Total** | | **82** |

Las pruebas cubren validaciones de entrada, operaciones principales de creación, consulta, actualización y eliminación, persistencia de cambios, emails duplicados, integridad referencial, filtrado de publicaciones por autor y respuestas de error. No representan una cobertura exhaustiva de todos los escenarios posibles.

Con PostgreSQL en funcionamiento y el archivo `.env` configurado, ejecutá:

```bash
npm test
```

Las pruebas de integración utilizan datos temporales en la base de datos configurada, correos únicos generados con `randomUUID()` y bloques `finally` para limpiar los registros creados. Las publicaciones temporales se eliminan antes que sus autores para respetar las claves foráneas. Ejecutalas contra una base local de desarrollo, no contra la base de producción.

## Despliegue en Railway

La API y PostgreSQL están desplegados como servicios de un proyecto de Railway.

1. Conectar el repositorio de GitHub a Railway.

2. Agregar un servicio PostgreSQL llamado `Postgres`.

3. Configurar las variables de entorno del servicio de la API.

4. Ejecutar `db/setup.sql` y `db/seed.sql` en la base PostgreSQL de Railway.

5. Generar un dominio público para el servicio de la API.

El servicio utiliza la detección automática del comando de inicio de Railway, sin un Start Command personalizado. El script `npm start` del proyecto ejecuta `node app.js`. El servidor utiliza el puerto asignado por Railway a través de `process.env.PORT`.

### Variables de entorno en Railway

```env
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
```

Estas referencias utilizan las credenciales internas del servicio `Postgres`. Para cargar los scripts SQL desde una computadora local se necesita una conexión pública a la base de Railway; esa dirección no es la URL pública de la API.

## Uso de inteligencia artificial

El registro del uso de ChatGPT durante el desarrollo está disponible en [DOCUMENTACION-IA.md](DOCUMENTACION-IA.md).

## Futuras mejoras

Como ampliación opcional del proyecto, se plantea incorporar un sistema de comentarios para las publicaciones.

Las mejoras previstas son:

- Crear una tabla `comments` en PostgreSQL, relacionada con autores y publicaciones mediante claves foráneas.

- Implementar endpoints REST para crear y consultar comentarios.

- Mantener la arquitectura actual del proyecto.

- Garantizar la integridad referencial y definir el comportamiento de los comentarios cuando se eliminen autores o publicaciones.

- Desplegar las nuevas funcionalidades en Railway.

**Estado:** pendiente de implementación. Estas mejoras forman parte de los objetivos opcionales del proyecto.
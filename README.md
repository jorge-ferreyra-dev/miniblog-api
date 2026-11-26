# MiniBlog API

**Versión 1.1.0**

API REST para gestionar autores, publicaciones y comentarios de un miniblog. Permite realizar operaciones CRUD sobre autores y publicaciones, y crear y consultar comentarios asociados a publicaciones y autores.

Desarrollada con Node.js, Express y PostgreSQL, y desplegada en Railway.

## Demo en producción

- [**Probar la API desde Swagger UI**](https://miniblog-api-production-a2d801da.up.railway.app/api-docs)
- [**API REST desplegada en Railway**](https://miniblog-api-production-a2d801da.up.railway.app/)

La API permite consultar y probar sus endpoints directamente desde Swagger UI, sin necesidad de instalar el proyecto localmente.

Los endpoints utilizan las rutas `/authors`, `/posts` y `/comments` (sin prefijo `/api`).

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

```
miniblog-api/
├── app.js
├── db/
│   ├── config.js
│   ├── setup.sql
│   ├── seed.sql
│   └── migrations/
│       └── 001_create_comments.sql
├── routes/
│   ├── authors.js
│   ├── posts.js
│   └── comments.js
├── services/
│   ├── authors.service.js
│   ├── posts.service.js
│   └── comments.service.js
├── validators/
│   ├── authors.validator.js
│   ├── posts.validator.js
│   ├── comments.validator.js
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
│   ├── common.validator.test.js
│   ├── comments.validator.test.js
│   └── comments.test.js
├── .env.example
├── .gitignore
├── openapi.yaml
├── package.json
├── package-lock.json
├── README.md
└── DOCUMENTACION-IA.md

```

`app.js` es el único punto de entrada de la aplicación. Configura Express, Swagger, las rutas y los middlewares. Mediante `require.main === module`, inicia el servidor únicamente cuando se ejecuta directamente, permitiendo importar la aplicación desde Supertest sin iniciar un servidor independiente.

## Endpoints

### Autores

| **Método** | **Ruta**       | **Descripción**           |
| ---------- | -------------- | ------------------------- |
| GET        | `/authors`     | Obtener todos los autores |
| GET        | `/authors/:id` | Obtener un autor por ID   |
| POST       | `/authors`     | Crear un autor            |
| PUT        | `/authors/:id` | Actualizar un autor       |
| DELETE     | `/authors/:id` | Eliminar un autor         |

### Publicaciones

| **Método** | **Ruta**                   | **Descripción**                       |
| ---------- | -------------------------- | ------------------------------------- |
| GET        | `/posts`                   | Obtener todas las publicaciones       |
| GET        | `/posts/:id`               | Obtener una publicación por ID        |
| GET        | `/posts/author/:author_id` | Obtener las publicaciones de un autor |
| POST       | `/posts`                   | Crear una publicación                 |
| PUT        | `/posts/:id`               | Actualizar una publicación            |
| DELETE     | `/posts/:id`               | Eliminar una publicación              |

### Comentarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/comments` | Obtener todos los comentarios |
| GET | `/comments/post/:post_id` | Obtener los comentarios de una publicación |
| POST | `/comments` | Crear un comentario |

### Integridad referencial

- Cada publicación pertenece a un autor y cada comentario pertenece a una publicación y a un autor.
- Al eliminar una publicación, sus comentarios se eliminan automáticamente (`ON DELETE CASCADE`).
- No se puede eliminar un autor con publicaciones o comentarios asociados (`ON DELETE RESTRICT`); la API responde `409 Conflict`.
- El contenido de un comentario debe ser un texto no vacío y sus IDs deben corresponder a registros existentes.

## Ejemplos de uso

Los siguientes comandos están pensados para Bash o Git Bash. Las respuestas son ejemplos: los IDs, las fechas y los datos pueden variar. Las operaciones de escritura modifican la base de datos de demostración en Railway.

### Obtener todos los autores

```
curl https://miniblog-api-production-a2d801da.up.railway.app/authors
```

**Respuesta de ejemplo (`200 OK`):**

```
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

```
curl https://miniblog-api-production-a2d801da.up.railway.app/authors/1
```

**Respuesta de ejemplo (`200 OK`):**

```
{
  "id": 1,
  "name": "Ana García",
  "email": "ana@example.com",
  "bio": "Desarrolladora full-stack apasionada por Node.js",
  "created_at": "2026-11-21T16:55:18.088Z"
}
```

### Crear un autor

```
curl -i -X POST https://miniblog-api-production-a2d801da.up.railway.app/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María Rodríguez",
    "email": "maria.rodriguez.ejemplo@example.com",
    "bio": "Ingeniera de software especializada en APIs"
  }'
```

**Respuesta de ejemplo (`201 Created`):**

```
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

```
curl -i -X PUT https://miniblog-api-production-a2d801da.up.railway.app/authors/4 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María Rodríguez",
    "email": "maria.rodriguez.ejemplo@example.com",
    "bio": "Ingeniera de software y speaker internacional"
  }'
```

**Respuesta de ejemplo (`200 OK`):**

```
{
  "id": 4,
  "name": "María Rodríguez",
  "email": "maria.rodriguez.ejemplo@example.com",
  "bio": "Ingeniera de software y speaker internacional",
  "created_at": "2026-11-23T15:20:56.035Z"
}
```

### Eliminar un autor

Reemplazá el ID por el de un autor de prueba sin publicaciones ni comentarios asociados.

```
curl -i -X DELETE https://miniblog-api-production-a2d801da.up.railway.app/authors/4
```

**Respuesta exitosa:** `204 No Content`. No se devuelve un cuerpo JSON.

### Crear una publicación

```
curl -i -X POST https://miniblog-api-production-a2d801da.up.railway.app/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introducción a PostgreSQL",
    "content": "PostgreSQL es una base de datos relacional de código abierto...",
    "author_id": 1,
    "published": true
  }'
```

**Respuesta de ejemplo (`201 Created`):**

```
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

```
curl https://miniblog-api-production-a2d801da.up.railway.app/posts/author/1
```

**Respuesta de ejemplo (`200 OK`):**

```
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

### Crear un comentario

Reemplazá los IDs por los de una publicación y un autor existentes.

```bash
curl -i -X POST https://miniblog-api-production-a2d801da.up.railway.app/comments \
  -H "Content-Type: application/json" \
  -d '{"post_id": 1, "author_id": 2, "content": "Excelente publicacion sobre Node.js"}'
```

**Respuesta exitosa:** `201 Created`, con el comentario creado.

### Consultar comentarios

```bash
curl -i https://miniblog-api-production-a2d801da.up.railway.app/comments
curl -i https://miniblog-api-production-a2d801da.up.railway.app/comments/post/1
```

Ambos endpoints devuelven `200 OK` y un array con los comentarios, incluyendo `author_name` y `post_title`. Una publicación existente sin comentarios devuelve `[]`; una publicación inexistente devuelve `404 Not Found` en la consulta filtrada.

Para consultar y probar los demás endpoints, utilizá Swagger UI.

## Documentación con Swagger UI

**Swagger en producción:** [https://miniblog-api-production-a2d801da.up.railway.app/api-docs](https://miniblog-api-production-a2d801da.up.railway.app/api-docs)

La especificación de la API se encuentra en `openapi.yaml`. Swagger UI permite consultar rutas, parámetros, esquemas y probar solicitudes desde el navegador.

Para acceder localmente, iniciá el servidor:

```
npm run dev
```

Abrí [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Ejecutar localmente

### Prerrequisitos

- Node.js 22 (versión utilizada en el proyecto)
- PostgreSQL 14 o superior
- Git

### Pasos

1. Clonar el repositorio e ingresar a la carpeta:
   ```
   git clone https://github.com/jorge-ferreyra-dev/miniblog-api.git
   cd miniblog-api
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=miniblog_db
   ```
   No subas el archivo `.env` con credenciales reales al repositorio.
4. Para una instalación nueva, crear la base de datos y ejecutar los scripts desde la raíz del proyecto:
   ```
   psql -U postgres -c "CREATE DATABASE miniblog_db;"
   psql -U tu_usuario -d miniblog_db -f db/setup.sql
   psql -U tu_usuario -d miniblog_db -f db/seed.sql
   ```
   Usá un usuario con permisos suficientes para crear las tablas. Si utilizás un usuario distinto de `postgres`, asegurate de que tenga acceso a `miniblog_db`.
5. Iniciar el servidor:
   ```
   npm run dev
   ```

La API estará disponible en [http://localhost:3000](http://localhost:3000/).

`npm run dev` ejecuta `app.js` en modo watch y carga las variables del archivo `.env`. El comando `npm start` ejecuta `node app.js` y utiliza las variables de entorno disponibles en el proceso, como las proporcionadas por Railway.

### Actualizar una instalación existente (v1.0.0)

Si ya existen las tablas `authors` y `posts` y todavía no existe `comments`, ejecutá únicamente la migración desde la raíz del proyecto:

```bash
psql -U tu_usuario -d miniblog_db -v ON_ERROR_STOP=1 -f db/migrations/001_create_comments.sql
```

La migración crea la tabla y sus índices dentro de una transacción. Utilizá un usuario con permisos suficientes y verificá que el usuario de la API tenga acceso a la nueva tabla. No vuelvas a ejecutar `setup.sql` ni `seed.sql` sobre una instalación existente. En una instalación nueva, `setup.sql` ya incluye `comments`, por lo que no es necesario ejecutar la migración.

## Pruebas automatizadas

El proyecto utiliza Vitest para las pruebas unitarias y Vitest junto con Supertest para las pruebas de integración con Express y PostgreSQL real.

La última ejecución local confirmada obtuvo **97 tests aprobados**: 76 unitarios y 21 de integración.

| **Archivo**                 | **Tipo**    | **Tests** |
| --------------------------- | ----------- | --------- |
| `common.validator.test.js` | Unitario | 16 |
| `authors.validator.test.js` | Unitario    | 30        |
| `posts.validator.test.js` | Unitario | 21 |
| `comments.validator.test.js` | Unitario | 9 |
| `app.test.js`               | Integración | 3         |
| `authors.test.js`           | Integración | 8         |
| `posts.test.js`             | Integración | 4         |
| `comments.test.js` | Integración | 6 |
| **Total** | | **97** |

Las pruebas cubren validaciones de entrada, operaciones principales de creación, consulta, actualización y eliminación, persistencia de cambios, emails duplicados, integridad referencial, filtrado de publicaciones por autor, creación y consulta de comentarios, eliminación en cascada, restricción de eliminación de autores y respuestas de error. No representan una cobertura exhaustiva de todos los escenarios posibles.

Con PostgreSQL en funcionamiento y el archivo `.env` configurado, ejecutá:

```
npm test
```

Las pruebas de integración utilizan datos temporales en la base de datos configurada, correos únicos generados con `randomUUID()` y bloques `finally` para limpiar los registros creados. Las publicaciones temporales se eliminan antes que sus autores para respetar las claves foráneas. Ejecutalas contra una base local de desarrollo, no contra la base de producción.

## Despliegue en Railway

La API y PostgreSQL están desplegados como servicios de un proyecto de Railway.

1. Conectar el repositorio de GitHub a Railway.
2. Agregar un servicio PostgreSQL llamado `Postgres`.
3. Configurar las variables de entorno del servicio de la API.
4. Para una base nueva, ejecutar `db/setup.sql` y `db/seed.sql` en PostgreSQL de Railway.
5. Generar un dominio público para el servicio de la API.

El servicio utiliza la detección automática del comando de inicio de Railway, sin un Start Command personalizado. El script `npm start` del proyecto ejecuta `node app.js`. El servidor utiliza el puerto asignado por Railway a través de `process.env.PORT`.

### Variables de entorno en Railway

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
```

Estas referencias utilizan las credenciales internas del servicio `Postgres`. Para cargar los scripts SQL desde una computadora local se necesita una conexión pública a la base de Railway; esa dirección no es la URL pública de la API.

### Migración y despliegue de la versión 1.1.0

Para actualizar la base existente de Railway se ejecutó la migración antes de integrar el código en `main`, mediante la conexión pública de PostgreSQL:

```bash
psql -h HOST_PUBLICO -p PUERTO_PUBLICO -U postgres -d railway -W -v ON_ERROR_STOP=1 -f db/migrations/001_create_comments.sql
```

Se verificaron las tablas con `\dt` y la estructura de `comments` con `\d comments`. Luego se integró `feature/comments` en `main` mediante un Pull Request, lo que activó el despliegue automático en Railway. Se comprobó el funcionamiento de los endpoints de consulta de autores y publicaciones, los tres endpoints de comentarios y Swagger UI en producción.

## Uso de inteligencia artificial

El registro del uso de ChatGPT durante el desarrollo está disponible en [DOCUMENTACION-IA.md](https://github.com/jorge-ferreyra-dev/miniblog-api/blob/main/DOCUMENTACION-IA.md).

## Futuras mejoras

Como posibles ampliaciones del proyecto, se plantean las siguientes funcionalidades:

- **Autenticación y autorización:** implementar un sistema de autenticación mediante JWT y control de acceso a los recursos.
- **Gestión de comentarios:** incorporar endpoints para actualizar y eliminar comentarios individuales.
- **Paginación y filtrado:** permitir consultas más eficientes sobre autores, publicaciones y comentarios.
- **Búsqueda de publicaciones:** incorporar búsquedas por título, contenido o autor.
- **Seguridad:** implementar limitación de solicitudes (rate limiting) y reforzar la protección de los endpoints.
- **Automatización CI/CD:** utilizar GitHub Actions para ejecutar las pruebas automatizadas antes de cada despliegue.
- **Registro y monitoreo:** incorporar un sistema de logs estructurados para facilitar la detección y el diagnóstico de errores en producción.

Estas mejoras permitirían evolucionar la API hacia una aplicación más completa, segura, escalable y mantenible.
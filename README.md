# Mi primera API

Paso a paso en el desarrollo de una API utilizando [Koa](https://koajs.com/) y [Sequelize](https://sequelize.org/)


## 1. "Hello world"

1. Crear proyecto: 
```bash 
yarn init
```

2. Agregar dependencies de Koa y similares: 
```bash 
yarn add koa koa-logger koa-router
```

3. Crear archivo `src/index.js` con código base:
```bash
mkdir src && touch src/index.js
```

4. Importar Koa y Logger, y creamos un servidor básico:
```javascript
// src/index.js
const Koa = require('koa');
// Middleware para registrar las peticiones HTTP
const Logger = require('koa-logger');

const app = new Koa();

app.use(Logger());

app.use((ctx, next) => {
  ctx.body = 'Hola mundo';
});

app.listen(3000);
```

5. Agregar dependencia dev Nodemon: 
```bash
yarn add nodemon --dev
```

6. Agregar script en `package.json`:
```diff
{
  ...
  "repository": "https://github.com/IIC2513/Mi-primera-API.git",
  "author": "Antonio Ossa-Guerra <aaossa@uc.cl>",
  "license": "MIT",
+  "scripts": {
+    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "koa": "^2.15.3",
    "koa-logger": "^3.2.1",
    ...
  },
}
```
7. Ejecutar servidor: 
```bash
yarn dev
```

7. Probar servidor en [localhost:3000/](http://localhost:3000/) esperando recibir `"Hello world"`


## 2. El primer router

1. Crear el primer router en `src/routes/movies.js` con código base:
```bash
mkdir src/routes && touch src/routes/movies.js
```

2. Agregar un endpoint básico al router:
```javascript
// src/routes/movies.js
const Router = require('koa-router');
const router = new Router();

// Metodo GET para obtener todas las películas
router.get('/', (ctx) => {
  ctx.body = 'GET /movies';
});

// Exportamos el router con los endpoints de películas
module.exports = router;
```

3. Crear el router principal en `src/routes/index.js`, al que se van a conectar los routers de cada recurso:
```javascript
// src/routes/index.js
const Router = require('koa-router');
// Importamos el router de películas
const movies = require('./movies');

const router = new Router();
// Conectamos el router de películas al router principal
router.use('/movies', movies.routes());

module.exports = router;
```

4. Modificar el servidor inicial en `src/index.js` para que utilice los endpoints alcanzables por medio del router principal:
```javascript
// src/index.js
const Koa = require('koa');
const Logger = require('koa-logger');
// Importamos el router principal
const router = require('./routes');

const app = new Koa();

app.use(Logger());

// Ahora el servidor utiliza el router principal
app.use(router.routes());

app.listen(3000);
```

4. Ejecutar servidor: 
```bash
yarn dev
```

5. Probar servidor en [localhost:3000/movies](http://localhost:3000/movies) esperando recibir `"GET /movies"`


## 3. Configurando Sequelize

1. Agregar dependencies de Sequelize y Postgres: `yarn add sequelize pg pg-hstore`

2. Agregar dependencia dev Sequelize CLI: `yarn add sequelize-cli --dev`

3. Crear carpetas base para Sequelize con el comando: `yarn sequelize-cli init`

4. Mover las carpetas creadas por el comando (`config/`, `migrations/`, `models/`, y `seeders/`) dentro de la carpeta `src/`

5. Crear archivo `.sequelizerc`:
```bash
# // .sequelizerc
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'config.json'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
}
```


## 4. Configurando Postgres

1. Instalar, configurar e iniciar Postgres: `sudo service postgresql start`

2. Iniciar sesión como el usuario de Postgres: `sudo -i -u postgres`

3. Crear base de datos: `createdb demo_dev` (cambiar "demo_dev" por tu base de datos)

4. Agregar usuario: `createuser aaossa` (cambiar "aaossa" por tu usuario)

5. Crear credenciales y dar permisos a usuario sobre la base de datos:
```bash
psql  # Iniciará la consola de postgres
alter user aaossa with encrypted password 'pwd';
grant all privileges on database demo_dev to aaossa;
alter user aaossa createdb;
exit  # Cerrará la consola de postgres
```

6. Cerrar la sesión del usuario de Postgres (abierta en paso 2): `exit`

Los pasos 2 a 6 deberían resultar en una interacción similar a esta:
```
> sudo -i -u postgres
postgres@LAPTOP-C5PQL48R:~$ createdb demo_dev
postgres@LAPTOP-C5PQL48R:~$ createuser aaossa
postgres@LAPTOP-C5PQL48R:~$ psql
psql (12.16 (Ubuntu 12.16-0ubuntu0.20.04.1))
Type "help" for help.

postgres=# alter user aaossa with encrypted password 'pwd';
ALTER ROLE
postgres=# grant all privileges on database demo_dev to aaossa;
GRANT
postgres=# alter user aaossa createdb;
ALTER ROLE
postgres=# exit
postgres@LAPTOP-C5PQL48R:~$ exit
logout
```

#### Tip: Si quieres verificar que todo está correcto, puedes ingresar a la consola de Postgres y listar las bases de datos y usuarios:
```
sudo -i -u postgres
psql
\l    # Listar bases de datos
\du   # Listar usuarios
\q    # Salir de la consola de Postgres
exit  # Salir del usuario de Postgres
```

7. Actualizar credenciales y datos en archivo `src/config/config.json`:
```json
 {
   "development": {
    "username": "aaossa",
    "password": "pwd",
    "database": "demo_dev",
     "host": "127.0.0.1",
    "dialect": "postgres"
   },
   "test": {
     "username": "root",
     "password": null,
     "database": "database_test",
     "host": "127.0.0.1",
    "dialect": "postgres"
   },
   "production": {
     "username": "root",
     "password": null,
     "database": "database_production",
     "host": "127.0.0.1",
    "dialect": "postgres"
   }
 }
```

8. De ser necesario, crear la base de datos con Sequelize CLI:
```bash
yarn sequelize-cli db:create
```
lanzará este error si ya se creó:
```
ERROR: database "demo_dev" already exists
error Command failed with exit code 1.
```


## 5. Creando el primer recurso (Tablas)

1. Creamos el modelo para la clase **Movie** (y su migración) usando Sequelize CLI: 
    - `yarn sequelize-cli model:generate --name Movie --attributes title:string,genre:string,description:string,rating:float`

2. Ejecutamos la migración para crear la tabla correspondiente en la DB: 
    - `yarn sequelize-cli db:migrate`

3. Creamos un archivo de *seeds* para la tabla de películas:
    - `yarn sequelize-cli seed:generate --name first-movies`

4. Agregamos nuestras propias *seeds* en el archivo creado:
```javascript
// src/seeders/*-first-movies.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Movies', [{
      title: 'Arrival',
      genre: 'Sci-fi/Thriller',
      description: 'Louise Banks, a linguistics expert, along with her team, must interpret the language of aliens who have come to Earth in a mysterious spaceship.',
      rating: 7.9,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Gone Girl',
      genre: 'Thriller/Mystery',
      description: 'Nick Dunne discovers that the entire media focus has shifted on him when his wife, Amy Dunne, mysteriously disappears on the day of their fifth wedding anniversary.',
      rating: 8.1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Movies', null, {});
  }
};
```

5. Agregamos las *seeds* a la base de datos: 
    - `yarn sequelize-cli db:seed:all`

6. Actualizamos el controlador de películas para cargar todas las películas disponibles:
```javascript
// src/routes/movies.js
const Router = require('koa-router');
const router = new Router();
// Importamos el modelo de películas
const { Movie } = require('../models');

// Metodo GET para obtener todas las películas
// Utilizamos async para poder esperar a que la consulta se complete
router.get('/', async (ctx) => {
  try {
    // Obtenemos todas las películas
    // Utilizamos el await para esperar a que la consulta se complete
    const movies = await Movie.findAll();
    ctx.body = movies;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.throw(500, 'Internal server error');
  }
});

module.exports = router;
```

7. Ejecutar servidor: 
```
yarn dev
```

8. Probar servidor en [localhost:3000/movies](http://localhost:3000/movies) esperando recibir:
```json
[
  {
    "id": 1,
    "title": "Arrival",
    "genre": "Sci-fi/Thriller",
    "description": "Louise Banks, a linguistics expert, along with her team, must interpret the language of aliens who have come to Earth in a mysterious spaceship.",
    "rating": 7.9,
    "createdAt": "2024-04-16T21:06:05.273Z",
    "updatedAt": "2024-04-16T21:06:05.273Z"
  },
  {
    "id": 2,
    "title": "Gone Girl",
    "genre": "Thriller/Mystery",
    "description": "Nick Dunne discovers that the entire media focus has shifted on him when his wife, Amy Dunne, mysteriously disappears on the day of their fifth wedding anniversary.",
    "rating": 8.1,
    "createdAt": "2024-04-16T21:06:05.273Z",
    "updatedAt": "2024-04-16T21:06:05.273Z"
  }
]
```


---

## Eliminado la base de datos

1. Ingresamos al usuario de Postgres: `sudo -i -u postgres`

2. Eliminamos la base de datos: `dropdb demo_dev`

3. Eliminamos al usuario: `dropuser aaossa`

4. Salimos del usuario de Postgres: `exit`

5. Detenemos el servicio de Postgres: `sudo service postgresql stop`

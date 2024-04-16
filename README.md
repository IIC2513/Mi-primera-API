# Mi primera API

Paso a paso en el desarrollo de una API utilizando [Koa](https://koajs.com/) y [Sequelize](https://sequelize.org/)


## 1. "Hello world"

1. Crear proyecto: `yarn init`

2. Agregar dependencies de Koa y similares: `yarn add koa koa-logger koa-router`

3. Crear archivo `src/index.js` con código base:
```diff
diff --git a/src/index.js b/src/index.js
new file mode 100644
index 0000000..0357462
--- /dev/null
+++ b/src/index.js
@@ -0,0 +1,13 @@
+// src/index.js
+const Koa = require('koa');
+const Logger = require('koa-logger');
+
+const app = new Koa();
+
+app.use(Logger());
+
+app.use((ctx, next) => {
+  ctx.body = 'Hola mundo';
+});
+
+app.listen(3000);

```
4. Agregar dependencia dev Nodemon: `yarn add nodemon --dev`

5. Agregar script en `package.json`:
```diff
diff --git a/package.json b/package.json
index b847a24..9c8579b 100644
--- a/package.json
+++ b/package.json
@@ -5,6 +5,9 @@
   "repository": "https://github.com/IIC2513/Mi-primera-API.git",
   "author": "Antonio Ossa-Guerra <aaossa@uc.cl>",
   "license": "MIT",
+  "scripts": {
+    "dev": "nodemon src/index.js"
+  },
   "dependencies": {
     "koa": "^2.15.3",
     "koa-logger": "^3.2.1",
```
6. Ejecutar servidor: `yarn dev`

7. Probar servidor en [localhost:3000/](http://localhost:3000/) esperando recibir `"Hello world"`


## 2. El primer router

1. Crear el primer router en `src/routes/movies.js` con código base:
```diff
diff --git a/src/routes/movies.js b/src/routes/movies.js
new file mode 100644
index 0000000..9a0eabe
--- /dev/null
+++ b/src/routes/movies.js
@@ -0,0 +1,9 @@
+// src/routes/movies.js
+const Router = require('koa-router');
+const router = new Router();
+
+router.get('/', (ctx) => {
+  ctx.body = 'GET /movies';
+});
+
+module.exports = router;
```

2. Crear el router principal en `src/routes/index.js`, al que se van a conectar los routers de cada recurso:
```diff
diff --git a/src/routes/index.js b/src/routes/index.js
new file mode 100644
index 0000000..5737586
--- /dev/null
+++ b/src/routes/index.js
@@ -0,0 +1,8 @@
+// src/routes/index.js
+const Router = require('koa-router');
+const movies = require('./movies');
+
+const router = new Router();
+router.use('/movies', movies.routes());
+
+module.exports = router;
```

3. Modificar el servidor inicial en `src/index.js` para que utilice los endpoints alcanzables por medio del router principal:
```diff
diff --git a/src/index.js b/src/index.js
index 0357462..3fbeca8 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,13 +1,12 @@
 // src/index.js
 const Koa = require('koa');
 const Logger = require('koa-logger');
+const router = require('./routes');

 const app = new Koa();

 app.use(Logger());

-app.use((ctx, next) => {
-  ctx.body = 'Hola mundo';
-});
+app.use(router.routes());

 app.listen(3000);
```

4. Ejecutar servidor: `yarn dev`

5. Probar servidor en [localhost:3000/movies](http://localhost:3000/movies) esperando recibir `"GET /movies"`


## 3. Configurando Sequelize

1. Agregar dependencies de Sequelize y Postgres: `yarn add sequelize pg pg-hstore`

2. Agregar dependencia dev Sequelize CLI: `yarn add sequelize-cli --dev`

3. Crear carpetas base para Sequelize con el comando: `yarn sequelize-cli init`

4. Mover las carpetas creadas por el comando (`config/`, `migrations/`, `models/`, y `seeders/`) dentro de la carpeta `src/`

5. Crear archivo `.sequelizerc`:
```diff
diff --git a/.sequelizerc b/.sequelizerc
new file mode 100644
index 0000000..0266f41
--- /dev/null
+++ b/.sequelizerc
@@ -0,0 +1,9 @@
+// .sequelizerc
+const path = require('path');
+
+module.exports = {
+  'config': path.resolve('src', 'config', 'config.json'),
+  'models-path': path.resolve('src', 'models'),
+  'seeders-path': path.resolve('src', 'seeders'),
+  'migrations-path': path.resolve('src', 'migrations')
+}
```


## 4. Configurando Postgres

1. Instalar, configurar e iniciar Postgres: `sudo service postgresql start`

2. Iniciar sesión como el usuario de Postgres: `su - postgres`

3. Crear base de datos: `createdb demo_dev` (cambiar "demo_dev" por tu base de datos)

4. Agregar usuario: `createuser aaossa` (cambiar "aaossa" por tu usuario)

5. Crear credenciales y dar permisos a usuario sobre la base de datos:
```bash
psq  # Iniciará la consola de postgres
alter user aaossa with encrypted password 'pwd';
grant all privileges on database demo_dev to aaossa;
alter user aaossa createdb;
exit  # Cerrará la consola de postgres
```

6. Cerrar la sesión del usuario de Postgres (abierta en paso 2): `exit`

Los pasos 2 a 6 deberían resultar en una interacción similar a esta:
```
> su - postgres
Password: 
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

7. Actualizar credenciales y datos en archivo `src/config/config.json`:
```diff
diff --git a/src/config/config.json b/src/config/config.json
index 0f858c6..c20b148 100644
--- a/src/config/config.json
+++ b/src/config/config.json
@@ -1,23 +1,23 @@
 {
   "development": {
-    "username": "root",
-    "password": null,
-    "database": "database_development",
+    "username": "aaossa",
+    "password": "pwd",
+    "database": "demo_dev",
     "host": "127.0.0.1",
-    "dialect": "mysql"
+    "dialect": "postgres"
   },
   "test": {
     "username": "root",
     "password": null,
     "database": "database_test",
     "host": "127.0.0.1",
-    "dialect": "mysql"
+    "dialect": "postgres"
   },
   "production": {
     "username": "root",
     "password": null,
     "database": "database_production",
     "host": "127.0.0.1",
-    "dialect": "mysql"
+    "dialect": "postgres"
   }
 }
```

8. De ser necesario, se puede crear la base de datos desde Sequelize CLI: `yarn sequelize-cli db:create` (lanzará error si ya se creó)

```
ERROR: database "demo_dev" already exists

error Command failed with exit code 1.
```


## 5. Creando el primer recurso

1. Creamos el modelo para la clase Movie (y su migración) usando Sequelize CLI: `yarn sequelize-cli model:generate --name Movie --attributes title:string,genre:string,description:string,rating:float`

2. Ejecutamos la migración para crear la tabla correspondiente en la DB: `yarn sequelize-cli db:migrate`

3. Creamos un archivo de *seeds* para la tabla de películas: `yarn sequelize-cli seed:generate --name first-movies`

4. Agregamos nuestras propias *seeds* en el archivo creado:
```diff
diff --git a/src/seeders/20240416204953-first-movies.js b/src/seeders/20240416204953-first-movies.js
new file mode 100644
index 0000000..8371761
--- /dev/null
+++ b/src/seeders/20240416204953-first-movies.js
@@ -0,0 +1,26 @@
+// src/seeders/*-first-movies.js
+'use strict';
+
+module.exports = {
+  async up(queryInterface, Sequelize) {
+    await queryInterface.bulkInsert('Movies', [{
+      title: 'Arrival',
+      genre: 'Sci-fi/Thriller',
+      description: 'Louise Banks, a linguistics expert, along with her team, must interpret the language of aliens who have come to Earth in a mysterious spaceship.',
+      rating: 7.9,
+      createdAt: new Date(),
+      updatedAt: new Date()
+    }, {
+      title: 'Gone Girl',
+      genre: 'Thriller/Mystery',
+      description: 'Nick Dunne discovers that the entire media focus has shifted on him when his wife, Amy Dunne, mysteriously disappears on the day of their fifth wedding anniversary.',
+      rating: 8.1,
+      createdAt: new Date(),
+      updatedAt: new Date()
+    }], {});
+  },
+
+  async down(queryInterface, Sequelize) {
+    await queryInterface.bulkDelete('Movies', null, {});
+  }
+};
```

5. Agregamos las *seeds* a la base de datos: `yarn sequelize-cli db:seed:all`

6. Actualizamos el controlador de películas para cargar todas las películas disponibles:
```diff
diff --git a/src/routes/movies.js b/src/routes/movies.js
index 9a0eabe..8b1a4c4 100644
--- a/src/routes/movies.js
+++ b/src/routes/movies.js
@@ -1,9 +1,16 @@
 // src/routes/movies.js
 const Router = require('koa-router');
 const router = new Router();
+const { Movie } = require('../models');

-router.get('/', (ctx) => {
-  ctx.body = 'GET /movies';
+router.get('/', async (ctx) => {
+  try {
+    const movies = await Movie.findAll();
+    ctx.body = movies;
+  } catch (error) {
+    console.log(error);
+    ctx.throw(404);
+  }
 });

 module.exports = router;
```

7. Ejecutar servidor: `yarn dev`

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

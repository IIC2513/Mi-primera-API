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

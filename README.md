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

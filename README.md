# API de Carrito de Compras - Coderhouse
Este proyecto simula una API para gestionar productos y carritos de compras. Implementa rutas
para obtener productos, agregar productos a un carrito y consultar el contenido de un carrito.
Además, se ha integrado un middleware de autorización simulado utilizando un JWT hardcodeado
para proteger todas las rutas de la API.

## Requisitos
- Node.js >= 16.x
- npm >= 8.x

## Instalación y Configuración
1. Clona este repositorio en tu máquina local:
```bash
git clone https://github.com/Jorgedc87/entrega1-jcalderon.git
```

2. Navega a la carpeta del proyecto:
```bash
cd entrega1-jcalderon
```

3. Instala las dependencias:
```bash
npm install
```

4. Crea una copia del archivo `.env.example` borrando el `.example` en la raíz del proyecto y agrega la siguiente variable:
```bash
JWT_SECRET=tu_clave_secreta_aqui
```

## Estructura del Proyecto
- **`/src`**: Contiene el código fuente de la API.
- **`/dao`**: Directorio que maneja las operaciones de la base de datos simulada (en este caso,
archivos JSON).
- **`/routes`**: Directorio que contiene las rutas para manejar las peticiones HTTP.
- **`/data`**: Directorio que simula la base de datos con los archivos `carts.json` y `products.json`.
- **`/middlewares`**: Directorio que contiene el middleware de autenticación simulado.

## Endpoints

### **IMPORTANTE**: EL BEARER TOKEN QUE SE ENVIA EN AUTHORIZATION DEBE SER EL MISMO QUE EL QUE SE AGREGA EN EL ARCHIVO .ENV. **MIRAR CONTENIDO DE INSTALACIÓN Y CONFIGURACIÓN**

### Productos
- **GET `/api/products`**: Obtiene todos los productos disponibles.
- **GET `/api/products/:pid`**: Obtiene un producto específico por su ID.
- **POST `/api/products`**: Crea un nuevo producto.
- **PUT `/api/products/:pid`**: Actualiza un producto existente.
- **DELETE `/api/products/:pid`**: Elimina un producto.

### Carritos
- **POST `/api/carts`**: Crea un nuevo carrito.
- **GET `/api/carts/:cid/products`**: Obtiene todos los productos en un carrito específico.
- **POST `/api/carts/:cid/products/:pid`**: Agrega un producto al carrito (simula la existencia del
producto).

## Simulación de Autenticación
Se ha implementado un middleware que simula la autenticación con JWT. Este middleware protege
todas las rutas de la API, permitiendo el acceso solo a aquellos usuarios que envíen el JWT
correcto.

- **JWT Hardcodeado**: El token JWT es verificado en cada solicitud y está hardcodeado en el
código. Si el token proporcionado no coincide con el valor esperado, se devuelve un error de "No
autorizado".
Para simular la autenticación, se debe enviar el token en el encabezado de la solicitud con la
siguiente estructura:
```bash
Authorization: Bearer <jwt_token>
```

### Middleware de Autorización
- El middleware se activa para todas las rutas, verificando el token en el encabezado de la solicitud.
- Si el token es válido, la solicitud continúa normalmente.
- Si el token es incorrecto o no está presente, la solicitud será rechazada con un error 401 (No
autorizado).

## Archivos importantes
- **`/src/routes/products.router.js`**: Rutas relacionadas con productos.
- **`/src/routes/cart.router.js`**: Rutas relacionadas con carritos.
- **`/src/middlewares/protected-route.js`**: Middleware de protección para verificar el JWT.
- **`/src/dao/CartManager.js`**: Lógica para gestionar los carritos de compras.
- **`/src/dao/ProductManager.js`**: Lógica para gestionar los productos.

## .gitignore
Se ha configurado un archivo `.gitignore` para evitar el seguimiento de archivos sensibles y
generados automáticamente:

```bash
# NODE
node_modules/
# Variables de entorno
.env
# Archivos de IDE
.vscode/
# Carpeta de Build
dist/
build/
```

## Licencia
Este proyecto está licenciado bajo la Licencia MIT.
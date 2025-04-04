
# API de Carrito de Compras - Coderhouse

Este proyecto simula una API para gestionar productos y carritos de compras. Implementa rutas para obtener productos, agregar productos a un carrito y consultar el contenido de un carrito. 

## Requisitos

- Node.js >= 16.x
- npm >= 8.x
- MongoDB

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

## Estructura del Proyecto

- `/src`: Contiene el código fuente de la API.
  - `/dao`: Directorio que maneja las operaciones de acceso a datos, incluyendo la integración con MongoDB.
  - `/routes`: Define las rutas para productos y carritos.
  - `/controllers`: Contiene la lógica de negocio para manejar las solicitudes.
  - `/models`: Define los esquemas de datos para productos y carritos.
- `/public`: Archivos estáticos y recursos públicos.
- `server.js`: Punto de entrada principal de la aplicación.

## Funcionalidades Principales

### Gestión de Productos

- **Obtener productos con filtros y paginación**: La ruta `GET /api/products` permite obtener una lista de productos con las siguientes opciones de query:

  - `limit` (opcional): Número de productos a devolver por página. Por defecto, es 10.
  - `page` (opcional): Página específica a obtener. Por defecto, es 1.
  - `sort` (opcional): Ordenamiento por precio, puede ser 'asc' o 'desc'.
  - `query` (opcional): Filtro para buscar productos por categoría o disponibilidad.

  La respuesta incluye información sobre la paginación:

  ```json
  {
    "status": "success",
    "payload": [/* productos */],
    "totalPages": 5,
    "prevPage": 1,
    "nextPage": 3,
    "page": 2,
    "hasPrevPage": true,
    "hasNextPage": true,
    "prevLink": "/api/products?page=1",
    "nextLink": "/api/products?page=3"
  }
  ```

### Gestión de Carritos

- **Eliminar un producto del carrito**: `DELETE /api/carts/:cid/products/:pid` elimina el producto seleccionado del carrito especificado.

- **Actualizar todos los productos del carrito**: `PUT /api/carts/:cid` reemplaza el contenido del carrito con un nuevo arreglo de productos.

- **Actualizar la cantidad de un producto en el carrito**: `PUT /api/carts/:cid/products/:pid` actualiza la cantidad de ejemplares.

## Vistas y Navegación

### Vista de Productos

- Ruta: `/products`
- Muestra todos los productos con paginación.
- Cada producto puede:
  - Llevar a una vista detallada: `/products/:pid` (con título, descripción, categoría, precio y botón para agregar al carrito).
  - Tener un botón directo para agregar al carrito sin entrar a otra vista.

### Vista de Carrito

- Ruta: `/carts/:cid`
- Muestra todos los productos del carrito específico con sus detalles completos gracias a `populate`.

## Tecnologías Utilizadas

- Node.js
- Express
- MongoDB con Mongoose
- Handlebars
- Websockets (socket.io)
- JSON Web Tokens (JWT)
- TailwindCSS (en views)

## Autor

Proyecto desarrollado por **Jorge Calderón** como parte del curso de Backend de **Coderhouse**.

- GitHub: [@Jorgedc87](https://github.com/Jorgedc87)
- Email: jorgedc87@gmail.com *(o el que desees colocar)*
- Portfolio (opcional): [Tu sitio si tenés]

## Licencia

Este proyecto está bajo la licencia MIT. Podés utilizarlo, modificarlo y distribuirlo libremente, siempre y cuando se incluya una copia del aviso de licencia original.

---

**¡Gracias por visitar el repositorio! Si te resultó útil, no dudes en darle una estrella ⭐ en GitHub.**

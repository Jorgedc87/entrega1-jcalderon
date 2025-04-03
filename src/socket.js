import ProductManagerMongo from './dao/ProductManagerMongo.js';

const productManager = new ProductManagerMongo();

const setupSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Enviar la lista de productos al cliente cuando se conecta
    const products = await productManager.findAll();
    socket.emit('updateProduct', products);

    // Agregar un nuevo producto
    socket.on('nuevoProducto', async (product) => {
      await productManager.create(product);
      const updatedProducts = await productManager.findAll();
      io.emit('actualizarProductos', updatedProducts); 
    });
    
    // Borrar un producto
    socket.on('eliminarProducto', async (id) => {
      console.log('Eliminando producto con ID:', id);
      await productManager.delete(id); 
      
      const updatedProducts = await productManager.findAll();
      
      io.emit('actualizarProductos', updatedProducts);  
  });

    // Desconexión
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};

export default setupSocket;

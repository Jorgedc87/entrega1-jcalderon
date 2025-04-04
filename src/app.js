import express from 'express';
import mongoose from 'mongoose';
import {config} from './config/config.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import setupSocket from './socket.js';

import ProductManager from './dao/ProductManager.js';
const productManager = new ProductManager('./src/data/products.json');

// Enviroments
const app = express();
const PORT = config.PORT || 8080;
const hbs = handlebars.create({
  helpers: {
    calcSubtotal: (price, quantity) => (price * quantity).toFixed(2),
    calcTotal: (products) =>
      products.reduce((acc, p) => acc + p.product.price * p.quantity, 0).toFixed(2),
  }
});

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Endpoint para verificar que el servidor está levantado
app.get('/api/ping', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('pong');
});

app.get('/', async (req, res) => {
  try {
    const products = await productManager.findAll();
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
const io = new Server(httpServer);

setupSocket(io); 

try {
  await mongoose.connect(
    config.MONGO_URL,
    {
      dbName: config.DB_NAME
    }
  )

  console.log('Conectado a la base de datos MongoDB');
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
}


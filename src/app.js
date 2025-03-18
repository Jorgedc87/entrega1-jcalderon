// app.js
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import setupSocket from './socket.js';

import ProductManager from './dao/ProductManager.js';
const productManager = new ProductManager('./src/data/products.json');

// Enviroments
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', engine());
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


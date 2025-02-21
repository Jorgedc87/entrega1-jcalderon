// Enviroments
require('dotenv').config();

const express = require('express');
const app = express();
const productsRouter=require('./routes/products.router.js');
const cartRouter=require('./routes/cart.router.js');
const authMiddleware = require('./middleware/auth.middleware.js');
const PORT=8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(authMiddleware);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

// Endpoint para verificar que el servidor está levantado
app.get('/api/ping',(req,res)=>{
  res.setHeader('Content-Type','text/plain');
  res.status(200).send('pong');
})

const server=app.listen(PORT,()=>{
  console.log(`Server escuchando en puerto ${PORT}`);
});
import { Router } from 'express';
import { CartManagerMongo } from '../dao/CartManagerMongo.js';

const router = Router();
const cartManager = new CartManagerMongo();

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.removeProduct(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.replaceCart(req.params.cid, req.body.products);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartManager.updateQuantity(req.params.cid, req.params.pid, quantity);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.clearCart(req.params.cid);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:cid/purchase', async (req, res) => {
  try {
    const purchaserEmail = req.body.email;
    if (!purchaserEmail) return res.status(400).json({ error: "Falta el email del comprador" });

    const result = await cartManager.purchaseCart(req.params.cid, purchaserEmail);
    if (!result.ticket) {
      return res.status(400).json({
        status: "error",
        message: "No se pudo procesar ningún producto. Verificá el stock. Recuerda que debes enviar el email en el body de la petición."
      });
    }

    res.json({
      status: "success",
      message: result.notProcessed.length
        ? "Compra parcial realizada"
        : "Compra completa realizada",
      ticket: result.ticket,
      productosNoProcesados: result.notProcessed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
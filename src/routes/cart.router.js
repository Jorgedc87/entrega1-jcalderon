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

export default router;
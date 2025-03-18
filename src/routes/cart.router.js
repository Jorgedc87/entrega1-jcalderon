import { Router } from 'express';
import CartManager from '../dao/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await CartManager.create();
        res.status(201).json(newCart);
    } catch (error) {
        return res.status(400).json({ message: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.getCartProducts(req.params.cid);
        if (!cart.success) {
            return res.status(404).json({ message: cart.error });
        }
        res.json(cart);
    } catch (error) {
        return res.status(400).json({ message: 'Error al obtener los productos del carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const result = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!result.success) {
            return res.status(404).json({ message: result.error });
        }
        res.status(201).json(result.cart);
    } catch (error) {
        return res.status(400).json({ message: 'Error al agregar el producto al carrito' });
    }
});

export default router;
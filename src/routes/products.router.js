const Router=require('express').Router;
const ProductManager = require('../dao/ProductManager.js');

const router=Router()

router.get('/', async (req, res) => {
    try {
        const products = await ProductManager.findAll();
        res.json(products);
    } catch (error) {
        return res.status(400).json({ message: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductManager.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        return res.status(400).json({ message: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await ProductManager.create(req.body);
        res.status(201).json(newProduct); 
    } catch (error) {
        return res.status(400).json({ message: 'Error al crear el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await ProductManager.update(req.params.pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
        }
        res.json(updatedProduct);
    } catch (error) {
        return res.status(400).json({ message: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await ProductManager.delete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
        }
        res.status(201).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        return res.status(400).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports=router
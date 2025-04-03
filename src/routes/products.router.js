import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';
import { isValidObjectId } from 'mongoose';

const router=Router()
const productManager = new ProductManagerMongo();

router.get("/", async (req, res) => {
    try {
      console.log("Obteniendo todos los productos...");
      const products = await productManager.findAll();
      res.json(products);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ message: "Error al obtener los productos:", error });
    }
  });

router.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    if(!isValidObjectId(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }
    const product = await productManager.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
    res.json(product); 
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.create(req.body);
        res.status(201).json(newProduct); 
    } catch (error) {
        return res.status(400).json({ message: 'Error al crear el producto', error });
    }
});

router.put('/:pid', async (req, res) => {
    let id = req.params.pid;
    if(!isValidObjectId(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }
    const updatedProduct = await productManager.update(req.params.pid, req.body);
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
    }
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productManager.delete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
        }
        res.status(201).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        return res.status(400).json({ message: 'Error al eliminar el producto' });
    }
});

export default router;
import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.findAll();
        res.render("home", {products});
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.findAll();
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error del lado del servidor");
    }
});

export default router;
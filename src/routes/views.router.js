import { Router } from "express";
import ProductManagerMongo from "../dao/ProductManagerMongo.js";
import { CartManagerMongo } from "../dao/CartManagerMongo.js";

const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await productManager.findAll(limit, page, sort, query);
    const payload = result.docs;
    const baseUrl = "/?"; 
    const queryParams = `limit=${limit || 10}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    const prevLink = result.hasPrevPage
      ? `${baseUrl}page=${result.prevPage}&${queryParams}`
      : null;

    const nextLink = result.hasNextPage
      ? `${baseUrl}page=${result.nextPage}&${queryParams}`
      : null;

    res.render("index", {
      payload,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink,
      nextLink,
      cartId: "67ef20f47f460edbb1182ebe"
    });
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

router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await productManager.findAll(limit, page, sort, query);

    const queryParams = { limit, sort, query };

    const prevLink = result.hasPrevPage
      ? buildQueryString('/', { ...queryParams, page: result.prevPage })
      : null;

    const nextLink = result.hasNextPage
      ? buildQueryString('/', { ...queryParams, page: result.nextPage })
      : null;

      res.render("index", {
        payload,
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink,
        nextLink,
        cartId: "67ef20f47f460edbb1182ebe",
        limit,
        query,
        sort
      });
  } catch (error) {
    console.error("Error al renderizar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productManager.findById(req.params.pid);
    const cart = await cartManager.getCartById("67ef20f47f460edbb1182ebe");

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", {
      ...product,
      cartId: cart._id,
      cartProducts: cart.products
    });
  } catch (error) {
    console.error("Error al mostrar detalle de producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);

    res.render("cart", {
      products: cart.products,
      cartId: cart._id 
    });
  } catch (err) {
    res.status(500).send("Error al cargar el carrito");
  }
});


function buildQueryString(base, params) {
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return query ? `${base}?${query}` : base;
}

export default router;
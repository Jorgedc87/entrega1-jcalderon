import fs from 'fs/promises';
import ProductManager from './ProductManager.js';

export default class CartManager {
  static path = "./src/data/carts.json";

  static async create() {
    try {
      const carts = await CartManager.findAll();
      const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
      const newCart = { id: newId, products: [] };
      carts.push(newCart);

      await fs.promises.writeFile(CartManager.path, JSON.stringify(carts, null, 2), "utf-8");
      return { success: true, cart: newCart };
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      return { success: false, error: "Error al crear el carrito." };
    }
  }

  static async getCartProducts(cid) {
    try {
      const carts = await CartManager.findAll();
      const cart = carts.find(c => c.id == cid);
  
      if (!cart) {
        return { success: false, error: "Carrito no encontrado." };
      }
  
      const cartProducts = [];
      let totalPrice = 0;
  
      for (const { product, quantity } of cart.products) {
        const productDetails = await ProductManager.findById(product);
        if (productDetails) {
          const productTotalPrice = productDetails.price * quantity;
          totalPrice += productTotalPrice;
      
          const { id, title, price, code, thumbnails } = productDetails;
      
          cartProducts.push({
            id,
            title,
            price,
            code,
            thumbnails,
            quantity,
            subtotalPrice: productTotalPrice.toFixed(2),
          });
        }
      }
      
  
      return { success: true, id: cart.id, products: cartProducts, totalPrice: totalPrice.toFixed(2) };
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
      return { success: false, error: "Error al obtener los productos del carrito." };
    }
  }
  

  static async addProductToCart(cid, pid) {
    try {
      const carts = await CartManager.findAll();
      const cart = carts.find(c => c.id == cid);

      if (!cart) {
        return { success: false, error: "Carrito no encontrado." };
      }

      const productDetails = await ProductManager.findById(pid);
      if (!productDetails) {
        return { success: false, error: "Producto no encontrado." };
      }

      if(productDetails.stock === 0){
        return { success: false, error: "Producto sin stock." };
      }

      const productIndex = cart.products.findIndex(p => p.product == pid);

      if (productIndex === -1) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products[productIndex].quantity += 1;
      }

      await fs.promises.writeFile(CartManager.path, JSON.stringify(carts, null, 2), "utf-8");
      return { success: true, cart: cart };
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      return { success: false, error: "Error al agregar el producto al carrito." };
    }
  }

  static async findAll() {
    try {
      await fs.promises.access(CartManager.path, fs.constants.F_OK);
      const data = await fs.promises.readFile(CartManager.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      console.error("Error al leer el archivo:", error);
      return [];
    }
  }
}
import { cartModel } from './models/cart.model.js';
import { productModel } from './models/product.model.js'
import { ticketModel } from './models/ticket.model.js';

export class CartManagerMongo {
  async getCartById(cid) {
    try {
      const cart = await cartModel.findById(cid).populate('products.product').lean();
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async createCart() {
    try {
      const newCart = await cartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error("Error al crear carrito");
    }
  }

  async addProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await productModel.findById(pid);
    if (!product) throw new Error("Producto no encontrado");

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return await cartModel.findById(cid).populate('products.product').lean();
  }

  async removeProduct(cid, pid) {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");
  
    const product = await productModel.findById(pid);
    if (!product) throw new Error("Producto no encontrado");
  
    const foundInCart = cart.products.find(p => p.product.toString() === pid);
    if (!foundInCart) throw new Error("El producto no está en el carrito");
  
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
  
    return await cartModel.findById(cid).populate('products.product').lean();
  }
  

  async updateQuantity(cid, pid, quantity) {
    const cart = await cartModel.findById(cid).populate('products.product');
    const item = cart.products.find(p => p.product._id.toString() === pid);
    if (!item) throw new Error("Producto no encontrado en el carrito");
  
    const stock = item.product.stock;
    if (quantity > stock) {
      throw new Error(`No hay suficiente stock disponible. Stock máximo: ${stock}`);
    }
  
    item.quantity = quantity;
    await cart.save();
    return await cartModel.findById(cid).populate('products.product').lean();
  }
  
  async replaceCart(cid, products) {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");
  
    for (const item of products) {
      const product = await productModel.findById(item.product);
      if (!product) throw new Error(`Producto con ID ${item.product} no encontrado`);
  
      if (item.quantity > product.stock) {
        throw new Error(`Stock insuficiente para ${product.title}. Máximo permitido: ${product.stock}`);
      }
    }
  
    cart.products = products;
    await cart.save();
    return await cartModel.findById(cid).populate('products.product').lean();
  }

  async clearCart(cid) {
    const cart = await cartModel.findById(cid);
    cart.products = [];
    await cart.save();
    return cart;
  }

  async purchaseCart(cid, purchaserEmail) {
    const cart = await cartModel.findById(cid).populate('products.product');
    if (!cart) throw new Error("Carrito no encontrado");
  
    const purchasedProducts = [];
    const unprocessedProducts = [];
    let totalAmount = 0;
  
    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
  
        purchasedProducts.push({
          productId: product._id,
          title: product.title,
          price: product.price,
          quantity: item.quantity
        });
  
        totalAmount += product.price * item.quantity;
      } else {
        unprocessedProducts.push({
          productId: product._id,
          title: product.title,
          requested: item.quantity,
          available: product.stock
        });
      }
    }
  
    let ticket = null;
    if (purchasedProducts.length > 0) {
      ticket = await ticketModel.create({
        amount: totalAmount,
        purchaser: purchaserEmail,
        cart: cart._id,
        products: purchasedProducts
      });
  
      cart.products = cart.products.filter(item =>
        unprocessedProducts.some(up => up.productId.equals(item.product._id))
      );
      await cart.save();
    }
  
    return {
      success: true,
      ticket,
      notProcessed: unprocessedProducts
    };
  }

}

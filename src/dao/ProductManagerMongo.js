import { productModel } from "./models/product.model.js";

export default class ProductManager{
  async findAll() {
    return await productModel.find().lean();
  }
  

  
  async findById(id) {
    return await productModel.findById(id).lean();
  }

  async create(product) {
    console.log("Creando producto:", product);
    let savedProduct;
    const validation = this.validateProduct(product);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }

    savedProduct = await productModel.create(product);
    return { success: true, product: savedProduct.toJSON() };
  }
  
  async update(id, product) {
    return await productModel.findByIdAndUpdate(id, product, { new: true });
  }
  

  async delete(id) {
    return await productModel.findByIdAndDelete(id);  
  }

  validateProduct(product) {
    let errors = "";
    let isValid = true;

    if (typeof product.title !== 'string' || product.title.trim() === '') {
        errors += "El título es obligatorio y debe ser una cadena no vacía. ";
        isValid = false;
    }

    if (typeof product.description !== 'string' || product.description.trim() === '') {
        errors += "La descripción es obligatoria y debe ser una cadena no vacía. ";
        isValid = false;
    }

    if (typeof product.code !== 'string' || product.code.trim() === '') {
        errors += "El código es obligatorio y debe ser una cadena no vacía. ";
        isValid = false;
    }

    if (typeof product.price !== 'number' || product.price <= 0) {
        errors += "El precio debe ser un número positivo. ";
        isValid = false;
    }

    if (typeof product.status !== 'boolean') {
        errors += "El estado debe ser un valor booleano. ";
        isValid = false;
    }

    if (typeof product.stock !== 'number' || product.stock < 0) {
        errors += "El stock debe ser un número entero no negativo. ";
        isValid = false;
    }

    if (typeof product.category !== 'string' || product.category.trim() === '') {
        errors += "La categoría es obligatoria y debe ser una cadena no vacía. ";
        isValid = false;
    }

    if (!Array.isArray(product.thumbnails) || !product.thumbnails.every(item => typeof item === 'string')) {
        errors += "Las imágenes deben ser un array de cadenas de texto. ";
        isValid = false;
    }

    return {
        isValid,
        errors: errors.trim()
    };
  }

}
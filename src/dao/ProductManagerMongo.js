import { productModel } from "./models/product.model.js";

export default class ProductManager{
  async findAll(limit = 10,page = 1, sort, query) {
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
  
    const filter = {};
    if (query) {
      if (query === 'disponible') {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query; 
      }
    }

    const options = {
      limit,
      page,
      lean: true
    };
  
    if (sort === 'asc' || sort === 'desc') {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    return await productModel.paginate(filter, options);
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

    if (typeof product.code !== 'number' || product.price <= 0) {
        errors += "El código es obligatorio y debe ser una numero positivo. ";
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
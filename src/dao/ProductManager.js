import fs from 'fs';

export default class ProductManager{
  static path = "./src/data/products.json"

  async findAll() {
    try {
        await fs.promises.access(ProductManager.path, fs.constants.F_OK);
        const data = await fs.promises.readFile(ProductManager.path, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        console.error("Error al leer el archivo:", error);
        return [];
    }
  }

  
  async findById(id) {
    try {
        await fs.promises.access(ProductManager.path, fs.constants.F_OK);
        const data = await fs.promises.readFile(ProductManager.path, "utf-8");
        const products = JSON.parse(data);
        const product = products.find(p => p.id == id);

        return product || null;
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return null;
    }
  }

  async create(product) {
    try {
      const validation = this.validateProduct(product); // Usamos 'this' para acceder al método de instancia
  
      if (!validation.isValid) {
        return { success: false, error: validation.errors };
      }
  
      const products = await this.findAll();
      let savedProduct;
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      savedProduct = { ...product, id: newId };
      products.push(savedProduct);
  
      await fs.promises.writeFile(ProductManager.path, JSON.stringify(products, null, 2), "utf-8");
      return { success: true, product: savedProduct };
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      return { success: false, error: "Error al guardar el producto." };
    }
  }
  
  async update(id, product) {
    try {
      const { id: productId, ...productWithoutId } = product;
      const validation = this.validateProduct(productWithoutId); // Usamos 'this' para acceder al método de instancia
  
      if (!validation.isValid) {
        return { success: false, error: validation.errors };
      }
  
      const products = await this.findAll();
      const productIndex = products.findIndex(p => p.id == id);
  
      if (productIndex === -1) {
        return { success: false, error: "Producto no encontrado." };
      }
  
      const updatedProduct = { ...products[productIndex], ...productWithoutId };
      products[productIndex] = updatedProduct;
  
      await fs.promises.writeFile(ProductManager.path, JSON.stringify(products, null, 2), "utf-8");
  
      return { success: true, product: updatedProduct };
  
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return { success: false, error: "Error al actualizar el producto." };
    }
  }
  

  async delete(id) {
    try {
        const products = await this.findAll();
        
        const productIndex = products.findIndex(p => p.id == id);

        if (productIndex === -1) {
            return { success: false, error: "Producto no encontrado." };
        }

        products.splice(productIndex, 1);

        await fs.promises.writeFile(ProductManager.path, JSON.stringify(products, null, 2), "utf-8");

        return { success: true };
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return { success: false, error: "Error al eliminar el producto." };
    }
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
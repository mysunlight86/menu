class Menu {
  products = [];
  loaded = false;

  add(product) {
    this.products.push(product);
  }

  getCategories() {
    const categories = new Set();
    for (const product of this.products) {
      categories.add(product.category);
    }
    return [...categories];
  }

  getProductsByCategory(category) {
    const categoryProducts = [];
    for (const product of this.products) {
      if (product.category === category) categoryProducts.push(product);
    }
    return categoryProducts;
  }

  getProductById(id) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        return this.products[i];
      }
    }
    return null;
  }

  put(products) {
    this.products = products;
  }
}

class Cart {
  products = [];

  add(product) {
    if (!this.products.includes(product)) {
      this.products.push(product);
    } else if (!product.count) {
      product.count = 2;
    } else {
      product.count++;
    }
  }

  removeProduct(id) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        if (!this.products[i].count) {
          this.products.splice(i, 1);
          return;
        } else if (this.products[i].count > 2) {
          this.products[i].count--;
          return;
        } else {
          delete this.products[i].count;
        }
      }
    }
  }

  getAllProducts() {
    return this.products;
  }

  getCount() {
    return this.products.length;
  }
}

export class Store {
  menu = new Menu();
  cart = new Cart();
}

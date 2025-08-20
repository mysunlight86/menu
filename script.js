// Model Classes

class Menu {
  products = [];

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
  
  getAllProducts() {
    return this.products;
  }

  getProductByTitle(title) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].title === title) {
        return this.products[i];
      }
    }
    return null;
  }
}

class Cart {
  products = [];

  add(product) {
    this.products.push(product);
  }

  addProductByTitle(title) {
    const product = menu.getProductByTitle(title); // create menu Model;
    console.log(product);
    if (product) {
      this.add(product);
    }
  }

  removeProductByTitle(title) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].title === title) {
        this.products.splice(i, 1);
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

// View

class ProductCardView {
  constructor(product) {
    this.product = product;
  }

  render() {
    this.element = document.createElement('li');
    this.element.classList.add('product');
    // this.container.append(this.element);
    // console.log(this.product);

    this.element.innerHTML = `
      <img class="productImage" src=${this.product.url} alt="Продукт">
      <p class="productTitle">${this.product.title}</p>
      <p class="productPrice">${this.product.price}</p>
    `;

    return this.element;
  }
}

class ProductCardListView {
  constructor(productList) {
    this.productList = productList;
  }

  render() {
    this.element = document.querySelector('.menuProducts');
    for (const product of this.productList) {
      const el = new ProductCardView(product).render();
      this.element.append(el);
    }
    return this.element;
  }
}

class CategoryTabView {
  constructor(category) {
    this.category = category;
  }

  render() {
    this.element = document.createElement('li');
    this.element.textContent = this.category;
    this.element.classList.add('category');
    // this.container.append(this.element);
    return this.element;
  }
}

class CategoriesTabsView {
  constructor(categoryList) {
    this.categoryList = categoryList;
  }

  render() {
    this.element = document.querySelector('.categories');
    for (const category of this.categoryList) {
      // new CategoryTabView(category).render();
      const el = new CategoryTabView(category).render();
      this.element.append(el);
    }
    return this.element;
  }
}

class CartIconView {
  constructor(cart) {
    this.cart = cart;
  }

  render() {
    const count = this.cart.getCount();
    // const cartIconElement = document.querySelector('.cartIcon');
    this.element = cartIconElement.querySelector('.orderCount');
    if (!this.element) {
      this.element = document.createElement('span');
      this.element.classList.add('orderCount');
      // cartIconElement.append(counterElement);
    }
    
    this.element.textContent = count;
    if (count > 0) {
      this.element.style.display = 'inline-block';
    } else {
      this.element.style.display = 'none';
    }

    return this.element;
  }
}

class CartListView {
  constructor(cart) {
    this.cart = cart;
  }

  render() {
    const cartProducts = this.cart.getAllProducts();
    this.element = document.querySelector('.cart');
    this.element.replaceChildren();
    for (const product of cartProducts) {
      const listItem = document.createElement('li');
      listItem.textContent = product.title;
      listItem.classList.add('cartProduct');
      this.element.append(listItem);
    }

    if (this.cart.getCount() === 0) {
      this.element.textContent = 'Вы пока ничего не выбрали';
    }

    return this.element;
  }
}

// Controllers

class MenuController {
  constructor(menu, cart) {
    this.currentCategory = '';
    this.menu = menu;
    this.cart = cart;
  }

  render() {
    const categoryList = this.menu.getCategories();
    this.el = new CategoriesTabsView(categoryList).render();

    const elements = this.el.getElementsByClassName('category');
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.handleTabClick);
    }
  }

  destroy() {
    const elements = this.el.getElementsByClassName('category')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleTabClick);
    }
  }

  renderProducts() {
    const menuProducts = this.menu.getProductsByCategory(this.currentCategory);
    this.els = new ProductCardListView(menuProducts).render();

    const elements = menuProductsElement.getElementsByClassName('product');
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.handleProductClick);
    }
  }

  destroyProducts() {
    const elements = menuProductsElement.getElementsByClassName('product');
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleProductClick);
    }
    if (elements.length > 0) {
      this.els.replaceChildren();
    }
  }

  handleTabClick = (event) => {
    this.destroyProducts();
    this.currentCategory = event.target.textContent.trim();
    this.renderProducts();
  }

  handleProductClick = (event) => {
    console.log(event.target);
    const productTitle = event.target.textContent.trim();
    this.cart.addProductByTitle(productTitle);
    console.log(this.cart);
    cartIconController.render();
    cartListController.render();
  }
}

class CartIconController {
  constructor(cart) {
    this.cart = cart;
  }

  render() {
    this.element = new CartIconView(this.cart).render();
    cartIconElement.append(this.element);
    cartIconElement.addEventListener('click', this.handleClick);
  }

  destroy() {
    cartIconElement.removeEventListener('click', this.handleClick);
  }

  toggleVisibility() {
    cartElement.classList.toggle('hidden');
  }

  handleClick = () => {
    this.toggleVisibility();
  };
}

class CartListController {
  constructor(cart) {
    this.cart = cart;
  }

  render() {
    this.element = new CartListView(this.cart).render();
    if (this.cart.getCount() > 0) {
      const elements = this.element.getElementsByClassName('cartProduct')
      for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', this.handleClick);
      }
    }
  }

  remove(title) {
    this.cart.removeProductByTitle(title);
    cartIconController.render();
    cartListController.render();
  }

  destroy() {
    const elements = cartElement.getElementsByClassName('cartProduct')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleClick);
    }
  }

  handleClick = (event) => {
    this.remove(event.target.textContent);
  };
}

// Initialization

const categoriesElement = document.querySelector('.categories');
const menuProductsElement = document.querySelector('.menuProducts');
const cartIconElement = document.querySelector('.cartIcon');
const cartElement = document.querySelector('.cart');

const menu = new Menu();

menu.add({ title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });

const cart = new Cart();

const menuController = new MenuController(menu, cart);
menuController.render();

const cartIconController = new CartIconController(cart);
cartIconController.render();

const cartListController = new CartListController(cart);
cartListController.render();

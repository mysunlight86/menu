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

  getProductById(id) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
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
    this.element.dataset.id = this.product.id;

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
    this.element.replaceChildren();
    for (const product of this.productList) {
      const el = new ProductCardView(product).render();
      this.element.append(el);
    }
    return this.element;
  }

  onClick(handler) {
    this.element.addEventListener('click', handler);
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
    this.element.dataset.id = this.category;
    return this.element;
  }
}

class CategoriesTabsView {
  constructor(categoryList) {
    this.categoryList = categoryList;
  }

  render() {
    this.element = document.querySelector('.categories');
    this.element.replaceChildren();
    for (const category of this.categoryList) {
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
    const display = count > 0 ? 'inline-block' : 'none';
    this.element = document.querySelector('.cartIcon');
    this.element.innerHTML = `<span class="orderCount" style="display: ${display}">${count}</span>`
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
  constructor(menu, cart, cartController) {
    this.currentCategory = '';
    this.menu = menu;
    this.cart = cart;
    this.cartController = cartController;
  }

  render() {
    const categoryList = this.menu.getCategories();
    this.categoriesTabsElement = new CategoriesTabsView(categoryList).render();

    const elements = this.categoriesTabsElement.getElementsByClassName('category');
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.handleTabClick);
    }
  }

  destroy() {
    const elements = this.categoriesTabsElement.getElementsByClassName('category')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleTabClick);
    }
  }

  renderProducts() {
    const menuProducts = this.menu.getProductsByCategory(this.currentCategory);
    this.productCardListView = new ProductCardListView(menuProducts);
    this.productCardListElement = this.productCardListView.render();
    this.productCardListView.onClick(this.handleProductClick);
  }

  destroyProducts() {
    const elements = menuProductsElement.getElementsByClassName('product');
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleProductClick);
    }
    if (elements.length > 0) {
      this.productCardListElement.replaceChildren();
    }
  }

  handleTabClick = (event) => {
    this.destroyProducts();
    this.currentCategory = event.target.textContent.trim();
    this.renderProducts();
  }

  handleProductClick = (event) => {
    const target = event.target;
    const cardElement = target.closest('[data-id]');
    if (!cardElement) return;
    const rawProductId = cardElement.dataset.id;
    const productId = parseInt(rawProductId, 10);

    const product = this.menu.getProductById(productId); 
    if (product) {
      this.cart.add(product);
    }

    this.cartController.renderIcon();
    this.cartController.renderCartList();
  }
}

class CartController {
  constructor(menu, cart) {
    this.menu = menu;
    this.cart = cart;
  }

  renderIcon() {
    this.iconElement = new CartIconView(this.cart).render();
    this.iconElement.addEventListener('click', this.handleIconClick);
  }

  destroyIconCart() {
    this.iconElement.removeEventListener('click', this.handleIconClick);
  }

  toggleVisibility() {
    cartElement.classList.toggle('hidden');
  }

  handleIconClick = () => {
    this.toggleVisibility();
  };

  renderCartList() {
    this.destroyCartCards();
    this.cartListElement = new CartListView(this.cart).render();
    if (this.cart.getCount() > 0) {
      const elements = this.cartListElement.getElementsByClassName('cartProduct')
      for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', this.handleCartCardClick);
      }
    }
  }

  remove(title) {
    this.cart.removeProductByTitle(title);
    this.renderIcon();
    this.renderCartList();
  }

  destroyCartCards() {
    const elements = cartElement.getElementsByClassName('cartProduct')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleCartCardClick);
    }
  }

  handleCartCardClick = (event) => {
    this.remove(event.target.textContent);
  };
}

// Initialization

const categoriesElement = document.querySelector('.categories');
const menuProductsElement = document.querySelector('.menuProducts');
const cartIconElement = document.querySelector('.cartIcon');
const cartElement = document.querySelector('.cart');

const menu = new Menu();

menu.add({ id: 1, title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ id: 2, title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
menu.add({ id: 3, title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
menu.add({ id: 4, title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
menu.add({ id: 5, title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
menu.add({ id: 6, title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ id: 7, title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ id: 8, title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
menu.add({ id: 9, title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });

const cart = new Cart();

const cartController = new CartController(menu, cart);
cartController.renderIcon();
cartController.renderCartList();

const menuController = new MenuController(menu, cart, cartController);
menuController.render();

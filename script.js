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

  removeProduct(id) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        this.products.splice(i, 1);
        return;
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

class View {
  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
  }

  off(eventType, handler){
    if (this.element) this.element.removeEventListener(eventType, handler);
  }
}

class CompositeView extends View {
  constructor() {
    super();
    this.children = [];
  }

  render() {
    this.element.replaceChildren();
    for (const child of this.children) {
      const el = child.render();
      this.element.append(el);
    }
    return this.element;
  }
}

class ProductCardView extends View {
  constructor(product) {
    super();
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

class ProductCardListView extends CompositeView {
  constructor(menu, category = menu.getCategories()[0]) {
    super();
    this.menu = menu;
    this.category = category;
  }

  render() {
    this.element = document.querySelector('.menuProducts');

    this.children = [];
    for (const product of this.menu.getProductsByCategory(this.category)) {
      this.children.push(new ProductCardView(product));
    }

    return super.render();
  }
}

class CategoryTabView extends View {
  constructor(category, isActive) {
    super();
    this.category = category;
    this.isActive = isActive
  }

  render() {
    this.element = document.createElement('li');
    this.element.textContent = this.category;
    this.element.classList.add('category');
    if (this.isActive) this.element.classList.add('active');
    this.element.dataset.id = this.category;
    return this.element;
  }
}

class CategoriesTabsView extends CompositeView {
  constructor(menu) {
    super();

    this.menu = menu;
    this.category = this.menu.getCategories()[0];
  }

  render() {
    this.element = document.querySelector('.categories');

    this.children = [];
    for (const category of menu.getCategories()) {
      this.children.push(new CategoryTabView(category, this.category === category))
    }

    return super.render();
  }
}

class CartIconView extends View {
  constructor(cart) {
    super();
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

class CartListItemView extends View {
  constructor(product) {
    super();
    this.product = product;
  }

  render() {
    this.element = document.createElement('li');
    this.element.textContent = this.product.title;
    this.element.classList.add('cartProduct');
    this.element.dataset.id = this.product.id;
    return this.element;
  }
}

class CartListView extends CompositeView {
  constructor(cart) {
    super();
    this.cart = cart;
  }

  render() {
    const cartProducts = this.cart.getAllProducts();
    this.element = document.querySelector('.cart');

    if (this.cart.getCount() === 0) {
      this.element.textContent = 'Вы пока ничего не выбрали';
      return;
    }

    this.children = [];
    for (const product of cartProducts) {
      this.children.push(new CartListItemView(product));
    }

    return super.render();
  }
}

// Controllers

class PubSubBus {
  handlers = {};

  subscribe(eventType, handler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
  }

  unsubscribe(eventType, handler) {
    if (!this.handlers[eventType]) return;
    const index = this.handlers[eventType].indexOf(handler);
    if (index === -1) return;
    this.handlers[eventType].splice(index, 1);
  }

  publish(eventType, args) {
    if (!this.handlers[eventType]) return;
    const handlers = Array.from(this.handlers[eventType]);
    for (const handler of handlers) {
      handler(args);
    }
  }
}


class MenuController {
  constructor(menu, cart, productCardListView, categoriesTabsView, pubSubBus) {
    this.menu = menu;
    this.currentCategory = this.menu.getCategories()[0];
    this.cart = cart;
    this.productCardListView = productCardListView;
    this.categoriesTabsView = categoriesTabsView;
    this.pubSubBus = pubSubBus;
  }

  render() {
    this.categoriesTabsView.category = this.currentCategory;
    this.categoriesTabsView.render();
    this.categoriesTabsView.on('click', this.handleTabClick);
  }

  destroy() {
     this.categoriesTabsView.element.removeEventListener('click', this.handleTabClick);
  }

  renderProducts() {
    this.productCardListView.category = this.currentCategory;
    this.productCardListView.render();
    this.productCardListView.on('click', this.handleProductClick);
  }

  destroyProducts() {
    this.productCardListView.off('click', this.handleProductClick);
  }

  handleTabClick = (event) => {
    if (event.target.classList.contains('category')) {
      this.currentCategory = event.target.textContent.trim();

      this.destroyProducts();
      this.renderProducts();

      this.destroy();
      this.render();
    }
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
      this.pubSubBus.publish('updated.cart');
    }
  }
}

class CartController {
  constructor(menu, cart, cartIconView, cartListView, pubSubBus) {
    this.menu = menu;
    this.cart = cart;
    this.cartIconView = cartIconView;
    this.cartListView = cartListView;
    this.pubSubBus = pubSubBus;
  }

  renderIcon() {
    this.cartIconView.render();
    this.cartIconView.on('click', this.handleIconClick);
    this.pubSubBus.subscribe('updated.cart', this.handleCartUpdated);
  }

  destroyIcon() {
    this.cartIconView.element.removeEventListener('click', this.handleIconClick);
    this.pubSubBus.unsubscribe('updated.cart', this.handleCartUpdated);
  }

  toggleVisibility() {
    cartElement.classList.toggle('hidden');
  }

  renderCartList() {
    this.destroyCartList();
    this.cartListView.render();
    if (this.cart.getCount() > 0) {
      this.cartListView.on('click', this.handleCartCardClick);
    }
  }

  remove(id) {
    this.cart.removeProduct(id);
    this.renderIcon();
    this.renderCartList();
  }

  destroyCartList() {
    this.cartListView.off('click', this.handleCartCardClick);
  }

  handleIconClick = () => {
    this.toggleVisibility();
  };

  handleCartCardClick = (event) => {
    const target = event.target;
    const cardElement = target.closest('[data-id]');
    if (cardElement) {
      const rawProductId = cardElement.dataset.id;
      const productId = parseInt(rawProductId, 10);
      this.remove(productId);

      this.renderIcon();
      this.renderCartList();
    }
  };

  handleCartUpdated = () => {
    this.destroyIcon();
    this.renderIcon();
    this.renderCartList();
  }
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

const cartIconView = new CartIconView(cart);
const cartListView = new CartListView(cart);

const pubSubBus = new PubSubBus();

const cartController = new CartController(menu, cart, cartIconView, cartListView, pubSubBus);
cartController.renderIcon();
cartController.renderCartList();

const productCardListView = new ProductCardListView(menu);
const categoriesTabsView = new CategoriesTabsView(menu);

const menuController = new MenuController(menu, cart, productCardListView, categoriesTabsView, pubSubBus);
menuController.render();
menuController.renderProducts();

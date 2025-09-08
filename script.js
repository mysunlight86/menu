class PubSubBus {
  static on(eventType, handler) {
    document.addEventListener(eventType, handler);
  }

  static off(eventType, handler) {
    document.removeEventListener(eventType, handler);
  }

  static publish(eventType, detail) {
    document.dispatchEvent(new CustomEvent(eventType, { detail }))
  }
}

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

class Store {
  menu = new Menu();
  cart = new Cart();
}

// View

class View {
  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
  }

  off(eventType, handler) {
    if (this.element) this.element.removeEventListener(eventType, handler);
  }
}

class CompositeView extends View {
  constructor() {
    super();
    this.children = [];
  }

  render() {
    const childrenElements = [];
    for (const child of this.children) {
      const el = child.render();
      childrenElements.push(el);
    }
    this.element.replaceChildren(...childrenElements);
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
    this.element.dataset.action = 'add-to-cart';

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
    this.element.dataset.action = 'change-category';
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
    for (const category of this.menu.getCategories()) {
      this.children.push(new CategoryTabView(category, this.category === category))
    }

    return super.render();
  }
}

class MenuView extends CompositeView {
  constructor(children) {
    super();
    this.element = document.querySelector('.menu');
    this.children = children;
  }
}

class HrView {
  render() {
    this.element = document.createElement('hr');
    return this.element;
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
    this.element.innerHTML = `<span class="orderCount" style="display: ${display}">${count}</span>`;
    this.element.dataset.action = 'toggle';
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
    this.element.dataset.action = 'remove-from-cart';
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
      this.element.innerHTML = `<li>Вы пока ничего не выбрали</li>`;
      return this.element;
    }

    this.children = [];
    for (const product of cartProducts) {
      this.children.push(new CartListItemView(product));
    }

    return super.render();
  }
}

class MainView extends CompositeView {
  constructor(children) {
    super();
    this.element = document.querySelector('.main');
    this.children = children;
  }
}

// Controllers

class MenuController {
  constructor(store, view) {
    this.view = view;
    this.store = store;
  }

  init() {
    this.view.on('click', this.handleClick);
    PubSubBus.on('changed.category', this.handleCategoryChanged);
    return this;
  }

  dispose() {
    this.view.off('click', this.handleClick);
    PubSubBus.off('changed.category', this.handleCategoryChanged);
  }

  handleClick = (event) => {
    const element = event.target.closest('[data-action]');

    if (!element) return;

    const action = element.dataset.action;
    const id = element.dataset.id;

    if (action === 'change-category') {
      PubSubBus.publish('changed.category', id);
    }

    if (action === 'add-to-cart') {
      const productId = parseInt(id, 10);
      const product = this.store.menu.getProductById(productId);
      if (product) {
        this.store.cart.add(product);
        PubSubBus.publish('updated.cart');
      }
    }
  }

  handleCategoryChanged = (event) => {
    const currentCategory = event.detail;
    this.view.category = currentCategory;
    this.view.render();
  }
}

class CartController {
  constructor(menu, cart, cartIconView, cartListView) {
    this.menu = menu;
    this.cart = cart;
    this.cartIconView = cartIconView;
    this.cartListView = cartListView;
  }

  init() {
    PubSubBus.on('updated.cart', this.handleCartUpdated);
  }

  dispose() {
    PubSubBus.off('updated.cart', this.handleCartUpdated);
  }

  renderIcon() {
    this.cartIconView.render();
    this.cartIconView.on('click', this.handleIconClick);
  }

  destroyIcon() {
    this.cartIconView.element.removeEventListener('click', this.handleIconClick);
  }

  renderCartList() {
    this.destroyCartList();
    this.cartListView.render();
    if (this.cart.getCount() > 0) {
      this.cartListView.on('click', this.handleCartCardClick);
    }
  }

  destroyCartList() {
    this.cartListView.off('click', this.handleCartCardClick);
  }

  handleCartUpdated = () => {
    this.renderIcon();
    this.renderCartList();
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
  }

  toggleVisibility() {
    cartElement.classList.toggle('hidden');
  }

  remove(id) {
    this.cart.removeProduct(id);
    this.renderIcon();
    this.renderCartList();
  }
}

// Initialization

const categoriesElement = document.querySelector('.categories');
const menuProductsElement = document.querySelector('.menuProducts');
const cartIconElement = document.querySelector('.cartIcon');
const cartElement = document.querySelector('.cart');

const store = new Store();

store.menu.add({ id: 1, title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 2, title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 3, title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 4, title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 5, title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 6, title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 7, title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 8, title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 9, title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });

const cartIconView = new CartIconView(store.cart);
const cartListView = new CartListView(store.cart);

const cartController = new CartController(store.menu, store.cart, cartIconView, cartListView);
cartController.renderIcon();
cartController.renderCartList();
cartController.init();

const productCardListView = new ProductCardListView(store.menu);
const categoriesTabsView = new CategoriesTabsView(store.menu);
const menuView = new MenuView([categoriesTabsView, productCardListView]);
const hrView = new HrView();
const mainView = new MainView([menuView, hrView, cartIconView, cartListView]);
mainView.render();

const menuController1 = new MenuController(store, categoriesTabsView).init();
const menuController2 = new MenuController(store, productCardListView).init();

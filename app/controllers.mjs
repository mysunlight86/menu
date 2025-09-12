import { PubSubBus } from './infrastructure.mjs';
import { Store } from './models.mjs';
import { ProductCardListView, CategoriesTabsView, MenuView, HrView, CartIconView, CartListView, ScreenView } from './view.mjs';

export class MenuController {
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

export class CartController {
  constructor(cart, view) {
    this.cart = cart;
    this.view = view;
  }

  init() {
    this.view.on('click', this.handleClick);
    PubSubBus.on('toggled.cart', this.toggleVisibility);
    PubSubBus.on('updated.cart', this.handleCartUpdated);
    return this;
  }

  dispose() {
    this.view.off('click', this.handleClick);
    PubSubBus.off('toggled.cart', this.toggleVisibility);
    PubSubBus.off('updated.cart', this.handleCartUpdated);
  }

  handleCartUpdated = () => {
    this.view.render();
  }

  handleClick = (event) => {
    const element = event.target.closest('[data-action]');

    if (!element) return;

    const action = element.dataset.action;
    const id = element.dataset.id;

    if (action === 'toggle') {
      PubSubBus.publish('toggled.cart');
    }

    if (action === 'remove-from-cart') {
      const productId = parseInt(id, 10);
      this.cart.removeProduct(productId);
      PubSubBus.publish('updated.cart');
    }
  }

  toggleVisibility = () => {
    if (this.view.toggle) this.view.toggle();
  }

  remove(id) {
    this.cart.removeProduct(id);
    PubSubBus.publish('updated.cart');
  }
}

export class NavigateButtonController {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.view.on('click', this.handleClick);
    return this;
  }

  dispose() {
    this.view.off('click', this.handleClick);
  }

  handleClick = (event) => {
    const element = event.target.closest('[data-action]');

    if (!element) return;

    const action = element.dataset.action;
    const id = element.dataset.id;

    if (action === 'navigate') {
      PubSubBus.publish('navigate', id);
    }
  }
}

export class MenuScreenController {
  controllers = [];

  constructor(store, view) {
    this.store = store;
    this.view = view;
  }

  init() {
    this.view.render();
    this.view.show();

    this.controllers = [
      new MenuController(this.store, this.view.categoriesTabsView).init(),
      new MenuController(this.store, this.view.productCardListView).init(),
      new CartController(this.store.cart, this.view.cartIconView).init(),
      new CartController(this.store.cart, this.view.cartListView).init(),
      new NavigateButtonController(this.view.orderBtn).init()
    ];

    this.view.cartListView.hide();
  }

  dispose() {
    for (const child of this.controllers) {
      child.dispose();
    }
    this.controllers = [];
    this.view.hide();
  }
}

export class OrderScreenController {
  controllers = [];

  constructor(store, view) {
    this.store = store;
    this.view = view;
  }

  init() {
    this.view.render();
    this.view.show();

    this.controllers = [
      new CartController(this.store.cart, this.view.cartListView).init(),
      new NavigateButtonController(this.view.orderBtn).init()
    ];

    this.view.cartListView.show();
  }

  dispose() {
    for (const child of this.controllers) {
      child.dispose();
    }
    this.controllers = [];
    this.view.hide();
  }
}

export class AppController {
  store = new Store();
  controllers = [];

  init() {
    this.loadSampleData();
  }

  dispose() {
    for (const child of this.controllers) {
      child.dispose();
    }
  }

  loadSampleData() {
    this.store.menu.add({ id: 1, title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 2, title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 3, title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 4, title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 5, title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 6, title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 7, title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 8, title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 9, title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });
  }
}

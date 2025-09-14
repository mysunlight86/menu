import { PubSubBus } from './infrastructure.mjs';
import { Store } from './models.mjs';
import { MenuScreenView, OrderScreenView } from './view.mjs';

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
    PubSubBus.on('loaded.data', this.handleDataLoaded);
    this.view.render();
    this.view.show();

    this.controllers = [
      new MenuController(this.store, this.view.categoryTabListView).init(),
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
    PubSubBus.off('loaded.data', this.handleDataLoaded);
  }

  handleDataLoaded = () => {
    this.view.render();
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

  constructor() {
    this.currentScreen = 'MenuScreen';
    this.loadData();
    this.controllers = {
      MenuScreen: new MenuScreenController(this.store, new MenuScreenView(this.store)),
      OrderScreen: new OrderScreenController(this.store, new OrderScreenView(this.store))
    };
  }

  init() {
    const controller = this.controllers[this.currentScreen];
    controller.init();
    PubSubBus.on('navigate', this.handleNavigate);
  }

  dispose() {
    const controller = this.controllers[this.currentScreen];
    controller.dispose();
    PubSubBus.off('navigate', this.handleNavigate);
  }

  handleNavigate = (event) => {
    const screen = event.detail;

    if (!this.controllers[screen]) {
      console.log(`Try navigate to unknown screen ${screen}`);
      return;
    }

    this.dispose();
    this.currentScreen = screen;
    this.init();
  }

  async loadData() {
    const data = await PubSubBus.getProducts();
    this.store.menu.put(data);
    this.store.loaded = true;
    PubSubBus.publish('loaded.data');
  }
}

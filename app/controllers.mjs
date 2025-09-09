import {PubSubBus} from './infrastructure.mjs';

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

class View {
  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
  }

  off(eventType, handler) {
    if (this.element) this.element.removeEventListener(eventType, handler);
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
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

export class ProductCardListView extends CompositeView {
  constructor(menu, category) {
    super();
    this.menu = menu;
    this.category = category;
    this.element = document.querySelector('.menuProducts');
  }

  render() {
    const category = this.category || this.menu.getCategories()[0];
    this.children = [];
    for (const product of this.menu.getProductsByCategory(category)) {
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

export class CategoryTabListView extends CompositeView {
  constructor(menu) {
    super();
    this.menu = menu;
    this.category = this.menu.getCategories()[0];
    this.element = document.querySelector('.categories');
  }

  render() {
    this.children = [];
    for (const category of this.menu.getCategories()) {
      this.children.push(new CategoryTabView(category, this.category === category))
    }

    return super.render();
  }
}

export class MenuView extends CompositeView {
  constructor(children) {
    super();
    this.element = document.querySelector('.menu');
    this.children = children;
  }
}

export class HrView extends View {
  render() {
    this.element = document.createElement('hr');
    return this.element;
  }
}

export class CartIconView extends View {
  constructor(cart) {
    super();
    this.cart = cart;
    this.element = document.querySelector('.cartIcon');
  }

  render() {
    const count = this.cart.getCount();
    const display = count > 0 ? 'inline-block' : 'none';
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

export class CartListView extends CompositeView {
  constructor(cart) {
    super();
    this.cart = cart;
    this.element = document.querySelector('.cart');
  }

  render() {
    const cartProducts = this.cart.getAllProducts();

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

  toggle() {
    this.element.classList.toggle('hidden');
  }
}

export class ButtonView extends View {
  constructor(params = {}) {
    super();
    this.element = document.createElement('button');
    this.element.type = 'button';
    this.element.dataset.action = params.action || '';
    this.element.dataset.id = params.id || '';
    this.element.innerText = params.text || 'Click Me!';
  }

  render() {
    return this.element;
  }
}

export class ScreenView extends CompositeView {
  constructor(children) {
    super();
    this.element = document.querySelector('.main');
    this.children = children;
  }

  show() {
    for (const child of this.children) {
      child.show();
    }
  }

  hide() {
    for (const child of this.children) {
      child.hide();
    }
  }
}

export class MenuScreenView extends ScreenView {
  constructor(store) {
    const productCardListView = new ProductCardListView(store.menu);
    const categoryTabListView = new CategoryTabListView(store.menu);
    const menuView = new MenuView([categoryTabListView, productCardListView]);
    const hrView = new HrView();
    const cartIconView = new CartIconView(store.cart);
    const cartListView = new CartListView(store.cart);
    const orderBtn = new ButtonView({ text: 'Complete Order', action: 'navigate', id: 'OrderScreen' });

    super([menuView, hrView, cartIconView, cartListView, orderBtn]);

    this.store = store;
    this.productCardListView = productCardListView;
    this.categoryTabListView = categoryTabListView;
    this.menuView = menuView;
    this.cartIconView = cartIconView;
    this.cartListView = cartListView;
    this.orderBtn = orderBtn;
  }
}

export class OrderScreenView extends ScreenView {
  constructor(store) {
    const cartListView = new CartListView(store.cart);
    const orderBtn = new ButtonView({ text: 'Order more', action: 'navigate', id: 'MenuScreen' });

    super([cartListView, orderBtn]);

    this.store = store;
    this.cartListView = cartListView;
    this.orderBtn = orderBtn;
  }
}

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
    this.element.removeEventListener(eventType, handler);
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

class ProductCardListView extends View {
  constructor(menu, category = menu.getCategories()[0]) {
    super();
    this.menu = menu;
    this.category = category;
  }

  render() {
    this.element = document.querySelector('.menuProducts');
    this.element.replaceChildren();
    for (const product of this.menu.getProductsByCategory(this.category)) {
      const el = new ProductCardView(product).render();
      this.element.append(el);
    }
    return this.element;
  }

  onClick(handler) {
    this.on('click', handler);
  }
}

class CategoryTabView extends View {
  constructor(menu, category = menu.getCategories()[0]) {
    super();
    this.menu = menu;
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

class CategoriesTabsView extends View {
  constructor(menu, categoryList = menu.getCategories()) {
    super();
    this.menu = menu;
    this.categoryList = categoryList;
  }

  render() {
    this.element = document.querySelector('.categories');
    this.element.replaceChildren();
    for (const category of this.categoryList) {
      const el = new CategoryTabView(this.menu, category).render();
      this.element.append(el);
    }
    return this.element;
  }

  onClick(handler) {
    this.on('click', handler);
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

  onClick(handler) {
    this.on('click', handler);
  }
}

class CartListView extends View {
  constructor(cart) {
    super();
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
      listItem.dataset.id = product.id;
      this.element.append(listItem);
    }

    if (this.cart.getCount() === 0) {
      this.element.textContent = 'Вы пока ничего не выбрали';
    }

    return this.element;
  }

  onClick(handler) {
    this.on('click', handler);
  }
}

// Controllers

class MenuController {
  constructor(menu, cart, productCardListView, categoriesTabsView, cartController) {
    this.currentCategory = 'Напитки';
    this.menu = menu;
    this.cart = cart;
    this.productCardListView = productCardListView;
    this.categoriesTabsView = categoriesTabsView;
    this.cartController = cartController;
  }

  render() {
    this.categoriesTabsView.render();
    this.categoriesTabsView.onClick(this.handleTabClick);
  }

  destroy() {
     this.categoriesTabsView.element.removeEventListener('click', this.handleTabClick);
  }

  renderProducts() {
    this.productCardListView = new ProductCardListView(this.menu, this.currentCategory);
    this.productCardListView.render();
    this.productCardListView.onClick(this.handleProductClick);
  }

  destroyProducts() {
    this.productCardListView.element.removeEventListener('click', this.handleProductClick);
    if (elements.length > 0) {
      this.productCardListView.element.replaceChildren();
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
  constructor(menu, cart, cartIconView, cartListView) {
    this.menu = menu;
    this.cart = cart;
    this.cartIconView = cartIconView;
    this.cartListView = cartListView;
  }

  renderIcon() {
    this.cartIconView.render();
    this.cartIconView.onClick(this.handleIconClick);
  }

  destroyIcon() {
    this.cartIconView.element.removeEventListener('click', this.handleIconClick);
  }

  toggleVisibility() {
    cartElement.classList.toggle('hidden');
  }

  handleIconClick = () => {
    this.toggleVisibility();
  };

  renderCartList() {
    this.destroyCartList();
    this.cartListView.render();
    if (this.cart.getCount() > 0) {
      this.cartListView.onClick(this.handleCartCardClick);
    }
  }

  remove(id) {
    this.cart.removeProduct(id);
    this.renderIcon();
    this.renderCartList();
  }

  destroyCartList() {
    // console.log(this);
    console.log(this.cartListView); // = {cart: Cart} ?
    console.log(this.cartListView.element); // = undefined ?

    this.cartListView.element.removeEventListener('click', this.handleCartCardClick); // ?
  }

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

const cartController = new CartController(menu, cart, cartIconView, cartListView);
cartController.renderIcon();
cartController.renderCartList();

const productCardListView = new ProductCardListView(menu);
const categoriesTabsView = new CategoriesTabsView(menu);

const menuController = new MenuController(menu, cart, productCardListView, categoriesTabsView, cartController);
menuController.render();
menuController.renderProducts();

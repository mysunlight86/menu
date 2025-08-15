// Model Classes

class Model {
  menu = [];
  cart = [];

  add(food) {
    this.menu.push(food);
  }

  getCategories() {
    const categories = new Set();
    for (const item of this.menu) {
      categories.add(item.category);
    }
    return [...categories];
  }

  getCategoryItems(category) {
    const categoryItems = [];
    for (const item of this.menu) {
      if (item.category === category) categoryItems.push(item);
    }
    return categoryItems;
  }

  getAllItems() {
    return this.menu;
  }

  getItemByTitle(title) {
    for (let i = 0; i < this.menu.length; i++) {
      if (this.menu[i].title === title) {
        return this.menu[i];
      }
    }
    return null;
  }

  addToCart(item) {
    this.cart.push(item);
  }

  addToCartByTitle(title) {
    const item = this.getItemByTitle(title);
    if (item) {
      this.addToCart(item);
    }
  }

  removeFromCartByTitle(title) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].title === title) {
        this.cart.splice(i, 1);
      }
    }
  }

  getAllItemsInCart() {
    return this.cart;
  }

  getCartCount() {
    return this.cart.length;
  }
}

// View and Controllers

class FoodCardView {
  constructor(container) {
    this.container = container;
  }

  render(model) {
    this.element = document.createElement('li');
    this.element.textContent = model.title;
    this.element.classList.add('item');
    this.container.append(this.element);
  }
}

// TODO: Create FoodCardListView, see CategoriesTabsView

class CategoryTabView {
  constructor(container) {
    this.container = container;
  }

  render(model) {
    this.element = document.createElement('li');
    this.element.textContent = model;
    this.element.classList.add('category');
    this.container.append(this.element);
  }
}

class CategoriesTabsView {
  constructor(tabsContainer) {
    this.tabsContainer = tabsContainer;
  }

  render(model) {
    const categories = model.getCategories();
    for (const category of categories) {
      new CategoryTabView(this.tabsContainer).render(category);
    }
  }
}

class CartIconView {
  constructor(element) {
    this.element = element;
  }

  render(model) {
    const count = model.getCartCount();
    const counterElement = this.element.querySelector('.orderCount')
    counterElement.textContent = count;
    if (count > 0) {
      counterElement.style.display = 'inline-block';
    } else {
      counterElement.style.display = 'none';
    }
  }
}

// TODO: Make as CategoryTabView
class CartListView {
  constructor(cart) {
    this.cart = cart;
  }

  /* remove(itemTitle) {
    this.cart.removeByTitle(itemTitle);
    this.render(this.parentElement);
    cartIcon.render(cartIconElement, orderCountElement);
  } */

  render(parentElement) {
    this.parentElement = parentElement;
    parentElement.replaceChildren();
    for (const item of this.cart.getAll()) {
      this.listItem = document.createElement('li');
      this.listItem.textContent = item.title;
      this.listItem.classList.add('cartItem');
      this.parentElement.append(this.listItem);
      // this.subscribe();
    }

    if (this.cart.getCount() === 0) {
      parentElement.textContent = 'Вы пока ничего не выбрали';
    }
  }

  toggleVisibility() {
    this.parentElement.classList.toggle('hidden');
  }

  /*

  subscribe() {
    this.listItem.addEventListener('click', this.handleClick);
  }

  unsubscribe() {
    this.listItem.removeEventListener('click', this.handleClick);
  }

  handleClick = (event) => {
    this.remove(event.target.textContent);
  }; */
}

// Controllers

class MenuController {
  constructor(model) {
    this.currentCategory = '';
    this.model = model;
  }

  render() {
    new CategoriesTabsView(categoriesElement).render(this.model);

    const elements = categoriesElement.getElementsByClassName('category')
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      elements[i].addEventListener('click', this.handleTabClick);
    }
  }

  destroy() {
    const elements = categoriesElement.getElementsByClassName('category')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleTabClick);
    }
  }

  renderItems() {
    const menuItems = this.model.getCategoryItems(this.currentCategory);
    for (const item of menuItems) {
      new FoodCardView(menuItemsElement).render(item);
    }

    const elements = menuItemsElement.getElementsByClassName('item')
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.handleItemClick);
    }
  }

  destroyItems() {
    const elements = menuItemsElement.getElementsByClassName('item')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleItemClick);
    }
    menuItemsElement.replaceChildren();
  }

  handleTabClick = (event) => {
    this.destroyItems();
    this.currentCategory = event.target.textContent.trim();
    this.renderItems();
  }

  handleItemClick = (event) => {
    const itemTitle = event.target.textContent.trim();
    this.model.addToCartByTitle(itemTitle);
    cartIconController.render();
  }
}

class CartIconController {
  constructor(model) {
    this.model = model;
  }

  render() {
    new CartIconView(cartIconElement).render(this.model);
    // TODO: handle click and toggle cart
  }

  handleClick() {
    cartList.toggleVisibility();
  }
}

// TODO: Make als MenuController
class CartListController {
  constructor(cart, cartListView) {
    this.cart = cart;
    this.cartListView = cartListView;
  }

  remove(itemTitle) {
    this.cart.removeByTitle(itemTitle);
    this.cartListView.render(this.parentElement);
    cartIcon.render(cartIconElement, orderCountElement);
  }

  toggleVisibility() {
    this.parentElement.classList.toggle('hidden');
  }

  render(parentElement) {
    this.parentElement = parentElement;
    this.cartListView.render(this.parentElement);
    if (this.cart.getCount() > 0) {
      this.cartListView.listItem.addEventListener('click', this.handleClick);
    }
  }

  destroy() {
    this.cartListView.listItem.removeEventListener('click', this.handleClick);
  }

  handleClick = (event) => {
    this.remove(event.target.textContent);
  };
}

// Initialization

const categoriesElement = document.querySelector('.categories'); // categories
const menuItemsElement = document.querySelector('.menuItems'); // menu items
const cartIconElement = document.querySelector('.cartIcon');
const orderCountElement = document.querySelector('.orderCount');
const cartElement = document.querySelector('.cart'); // cart

const model = new Model();

model.add({ title: 'Сок', category: 'Напитки' });
model.add({ title: 'Вода', category: 'Напитки' });
model.add({ title: 'Чай', category: 'Напитки' });
model.add({ title: 'Мимоза', category: 'Салаты' });
model.add({ title: 'Оливье', category: 'Салаты' });
model.add({ title: 'Цезарь', category: 'Салаты' });
model.add({ title: 'Пудинг', category: 'Десерты' });
model.add({ title: 'Йогурт', category: 'Десерты' });
model.add({ title: 'Мороженое', category: 'Десерты' });

const controller = new MenuController(model);
controller.render();

const cartIconController = new CartIconController(model);
cartIconController.render();



// new MenuController(menu).render(categoriesElement, menuItemsElement);

// const cartIcon = new CartIconView(cart);
// new CartIconController(cartIconElement, cartIcon).render(orderCountElement);

// const cartList = new CartListView(cart);
// // cartList.render(cartElement); */
// new CartListController(cart, cartList).render(cartElement);

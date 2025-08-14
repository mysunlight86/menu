// Model Classes

class Food {
  constructor(title, category) {
    this.title = title;
    this.category = category;
  }
}

class Menu {
  constructor() {
    this.items = [];
  }

  add(food) {
    this.items.push(food);
  }

  getCategories() {
    const categories = new Set();
    for (const item of this.getAll()) {
      categories.add(item.category);
    }
    return [...categories];
  }

  getCategoryItems(category) {
    const categoryItems = [];
    for (const item of this.getAll()) {
      if (item.category === category) categoryItems.push(item);
    }
    return categoryItems;
  }

  getAll() {
    return this.items;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  removeByTitle(title) {
    for (const item of this.items) {
      if (item.title === title.trim()) {
        const itemIndex = this.items.indexOf(item);
        if (itemIndex === -1) return;
        this.items.splice(itemIndex, 1);
      }
    }
    return null;
  }

  getAll() {
    return this.items;
  }

  getCount() {
    return this.items.length;
  }
}

// View and Controllers

class FoodCardView {
  constructor(food) {
    this.food = food;
  }

  render(parentElement) {
    this.element = document.createElement('li');
    this.element.textContent = this.food.title;
    this.element.classList.add('item');
    parentElement.append(this.element);
  }
}

class CategoryView {
  constructor(title) {
    this.title = title;
  }

  render(parentElement) {
    this.element = document.createElement('li');
    this.element.textContent = this.title;
    this.element.classList.add('option');
    parentElement.append(this.element);
  }
}

class CartIconView {
  constructor(cart) {
    this.cart = cart;
    this.handleclick = this.handleclick.bind(this);
  }

  render(element, counterElement) {
    this.element = element;
    const count = this.cart.getCount();
    counterElement.textContent = count;
    if (count > 0) {
      counterElement.style.display = 'inline-block';
    } else {
      counterElement.style.display = 'none';
    }
    this.subscribe();
  }

  subscribe() {
    this.element.addEventListener('click', this.handleclick);
  }

  unsubscribe() {
    this.element.removeEventListener('click', this.handleclick);
  }

  handleclick() {
    cartList.toggleVisibility();
  }
}

class CartListView {
  constructor(cart) {
    this.cart = cart;
  }

  remove(itemTitle) {
    this.cart.removeByTitle(itemTitle);
    this.render(this.parentElement);
    cartIcon.render(cartIconElement, orderCountElement);
  }

  render(parentElement) {
    this.parentElement = parentElement;
    parentElement.replaceChildren();
    for (const item of this.cart.getAll()) {
      this.listItem = document.createElement('li');
      this.listItem.textContent = item.title;
      this.listItem.classList.add('cartItem');
      parentElement.append(this.listItem);
      this.subscribe();
    }

    if (this.cart.getCount() === 0) {
      parentElement.textContent = 'Вы пока ничего не выбрали';
    }
  }

  toggleVisibility() {
    this.parentElement.classList.toggle('hidden');
  }

  subscribe() {
    this.listItem.addEventListener('click', this.handleClick);
  }

  unsubscribe() {
    this.listItem.removeEventListener('click', this.handleClick);
  }

  handleClick = (event) => {
    this.remove(event.target.textContent);
  };
}

// Controllers

class FoodCardController {
  constructor(food, cardView, cart, cartView, cartIconView) {
    this.food = food;
    this.cardView = cardView;
    this.cart = cart;
    this.cartView = cartView;
    this.cartIconView = cartIconView;
  }

  render(parentElement) {
    this.cardView.render(parentElement);
    this.cardView.element.addEventListener('click', this.handleClick);
  }

  destroy() {
    this.cardView.element.removeEventListener('click', this.handleClick);
  }

  handleClick = () => {
    this.cart.add(this.food);
    this.cartView.render(cartContentElement);
    this.cartIconView.render(cartIconElement, orderCountElement);
  };
}

class CategoryController {
  constructor(items, categoryView) {
    this.categoryView = categoryView;
    this.items = items;
    this.cardsControllers = [];
  }

  render(parentElement, itemsContainer) {
    this.itemsContainer = itemsContainer;
    this.categoryView.render(parentElement);
    this.categoryView.element.addEventListener('click', this.handleClick);
  }

  destroy() {
    this.categoryView.element.removeEventListener('click', this.handleClick);
  }

  renderCards() {
    this.itemsContainer.innerHTML = '';
    for (let i = 0; i < this.items.length; i++) {
      const card = new FoodCardView(this.items[i]);
      const cardController = new FoodCardController(
        this.items[i],
        card,
        cart,
        cartList,
        cartIcon
      );
      cardController.render(this.itemsContainer);
    }
  }

  handleClick = () => {
    this.renderCards();
  };
}

class MenuController {
  constructor(menu) {
    this.menu = menu;
  }

  render(element, itemsContainer) {
    const categories = this.menu.getCategories();
    for (const category of categories) {
      const items = this.menu.getCategoryItems(category);
      const categoryView = new CategoryView(category);
      const categoryController = new CategoryController(items, categoryView);
      categoryController.render(element, itemsContainer);
    }
  }
}

// Initialization

const categoriesElement = document.querySelector('.categories'); // categories
const menuItemsElement = document.querySelector('.menuItems'); // menu items
const cartIconElement = document.querySelector('.cartIcon');
const orderCountElement = document.querySelector('.orderCount');
const cartContentElement = document.querySelector('.cartContent'); // cart

const menu = new Menu();
const cart = new Cart();

menu.add(new Food('Вода', 'Напитки'));
menu.add(new Food('Сок', 'Напитки'));
menu.add(new Food('Чай', 'Напитки'));
menu.add(new Food('Мимоза', 'Салаты'));
menu.add(new Food('Оливье', 'Салаты'));
menu.add(new Food('Цезарь', 'Салаты'));
menu.add(new Food('Пудинг', 'Десерты'));
menu.add(new Food('Йогурт', 'Десерты'));
menu.add(new Food('Мороженое', 'Десерты'));

new MenuController(menu).render(categoriesElement, menuItemsElement);

const cartIcon = new CartIconView(cart);
cartIcon.render(cartIconElement, orderCountElement);

const cartList = new CartListView(cart);
cartList.render(cartContentElement);

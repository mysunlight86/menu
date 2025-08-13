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

  remove(item) {
    const itemIndex = this.items.indexOf(item);
    if (itemIndex === -1) return;
    this.items.splice(itemIndex, 1);
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
    this.element = document.createElement("li");
    this.element.textContent = this.food.title;
    this.element.classList.add("item");
    parentElement.append(this.element);
    this.subscribe();
  }

  subscribe() {
    this.element.addEventListener("click", this.handleClick);
  }

  unsubscribe() {
    this.element.removeEventListener("click", this.handleClick);
  }

  // Method 2

  handleClick = () => {
    cart.add(this.food);
    cartList.render(cartContentElement);
    cartIcon.render(cartIconElement, orderCounterElement);
  };
}

class CategoryView {
  constructor(title, items) {
    this.title = title;
    this.items = items;

    // Method 1
    this.handleClick = this.handleClick.bind(this);
  }

  render(parentElement, itemsContainer) {
    this.itemsContainer = itemsContainer;
    this.listItem = document.createElement("li");
    this.listItem.textContent = this.title;
    this.listItem.classList.add("option");
    parentElement.append(this.listItem);
    this.subscribe();
  }

  subscribe() {
    this.listItem.addEventListener("click", this.handleClick);
  }

  unsubscribe() {
    this.listItem.removeEventListener("click", this.handleClick);
  }

  handleClick() {
    // TODO: unsubscribe other elements
    this.itemsContainer.innerHTML = "";
    for (let i = 0; i < this.items.length; i++) {
      const card = new FoodCardView(this.items[i]);
      card.render(this.itemsContainer);
    }
  }
}

class MenuView {
  constructor(items) {
    this.items = items;
  }

  getCategories() {
    // TODO: move to model
    const categories = new Set();
    for (const item of this.items.getAll()) {
      categories.add(item.category);
    }
    return [...categories];
  }

  getCategoryItems(category) {
    // TODO: move to model
    const items = [];
    for (const item of this.items.getAll()) {
      if (item.category === category) items.push(item);
    }
    return items;
  }

  render(element, itemsContainer) {
    const categories = this.getCategories();
    for (const category of categories) {
      const categoryView = new CategoryView(
        category,
        this.getCategoryItems(category)
      );
      categoryView.render(element, itemsContainer);
    }
  }
}

class CartIconView {
  constructor(cart) {
    this.cart = cart;
    this.handleclick = this.handleclick.bind(this);
  }

  render(element, counterElement) {
    this.element = element;
    const counter = this.cart.getCount();
    counterElement.textContent = counter;
    if (counter > 0) {
      counterElement.style.display = "inline-block";
    } else {
      counterElement.style.display = "none";
    }
    this.subscribe();
  }

  subscribe() {
    this.element.addEventListener("click", this.handleclick);
  }

  unsubscribe() {
    this.element.removeEventListener("click", this.handleclick);
  }

  handleclick() {
    cartList.toggleVisibility();
  }
}

class CartListView {
  constructor(cart) {
    this.cart = cart;
  }

  getElementByTitle(title) {
    // TODO: move to model >> this.cart.removeByTitle(title)
    for (const item of this.cart.getAll()) {
      if (item.title === title.trim()) return item;
    }
    return null;
  }

  remove(itemTitle) {
    const item = this.getElementByTitle(itemTitle);
    this.cart.remove(item);
    this.render(this.parentElement);
    cartIcon.render(cartIconElement, orderCounterElement);
  }

  render(parentElement) {
    this.parentElement = parentElement;
    parentElement.replaceChildren();
    for (const item of this.cart.getAll()) {
      this.listItem = document.createElement("li");
      this.listItem.textContent = item.title;
      this.listItem.classList.add("cartItem");
      parentElement.append(this.listItem);
      this.subscribe();
    }

    if (this.cart.getCount() === 0) {
      parentElement.textContent = "Вы пока ничего не выбрали";
    }
  }

  toggleVisibility() {
    this.parentElement.classList.toggle("hidden");
  }

  subscribe() {
    this.listItem.addEventListener("click", this.handleClick);
  }

  unsubscribe() {
    this.listItem.removeEventListener("click", this.handleClick);
  }

  handleClick = (event) => {
    this.remove(event.target.textContent);
  };
}

// Initialization

const optionsElement = document.querySelector(".options");
const selectionElement = document.querySelector(".selection");
const cartIconElement = document.querySelector(".cartIcon");
const orderCounterElement = document.querySelector(".orderCounter");
const cartContentElement = document.querySelector(".cartContent");

const menu = new Menu();
const cart = new Cart();

menu.add(new Food("Вода", "Напитки"));
menu.add(new Food("Сок", "Напитки"));
menu.add(new Food("Чай", "Напитки"));
menu.add(new Food("Мимоза", "Салаты"));
menu.add(new Food("Оливье", "Салаты"));
menu.add(new Food("Цезарь", "Салаты"));
menu.add(new Food("Пудинг", "Десерты"));
menu.add(new Food("Йогурт", "Десерты"));
menu.add(new Food("Мороженое", "Десерты"));

new MenuView(menu).render(optionsElement, selectionElement);

const cartIcon = new CartIconView(cart);
cartIcon.render(cartIconElement, orderCounterElement);

const cartList = new CartListView(cart);
cartList.render(cartContentElement);

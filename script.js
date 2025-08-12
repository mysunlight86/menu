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

  add(food) {
    this.items.push(food);
  }

  getAll() {
    return this.items;
  }

  getCount() {
    return this.items.length;
  }
}

// View and Controllers

class FoodCard {
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
    cartList.render(cartContent);
    cartCounter.render(document.querySelector(".orderCounter"));
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
      const card = new FoodCard(this.items[i]);
      card.render(this.itemsContainer);
    }
  }
}

class MenuView {
  constructor(items) {
    this.items = items;
  }

  getCategories() {
    const categories = new Set();
    for (const item of this.items.getAll()) {
      categories.add(item.category);
    }
    return [...categories];
  }

  getCategoryItems(category) {
    const items = [];
    for (const item of this.items.getAll()) {
      if (item.category === category) items.push(item);
    }
    return items;
  }

  render(parentElement, itemsContainer) {
    const categories = this.getCategories();
    for (const category of categories) {
      const categoryView = new CategoryView(
        category,
        this.getCategoryItems(category)
      );
      categoryView.render(parentElement, itemsContainer);
    }
  }
}

class CartIcon {
  constructor(cartElement, cart) {
    this.cartElement = cartElement;
    this.cart = cart;
    this.handleclick = this.handleclick.bind(this);
  }

  subscribe() {
    this.cartElement.addEventListener("click", this.handleclick);
  }

  unsubscribe() {
    this.cartElement.removeEventListener("click", this.handleclick);
  }

  handleclick() {
    const cartContent = document.querySelector(".cartContent");
    cartContent.style.display = "flex";

    if (this.cart.getCount() === 0) {
      cartContent.textContent = "Вы пока ничего не выбрали";
    }
  }
}

class CartCounter {
  constructor(cart) {
    this.cart = cart;
  }

  render(parentElement) {
    const counter = this.cart.getCount();
    parentElement.textContent = counter;
    if (counter > 0) {
      parentElement.style.display = "inline-block";
    }
  }
}

class CartList {
  constructor(cart) {
    this.cart = cart;
  }

  getElementByTitle(title) {
    for (let item of this.cart) {
      if (item.includes(title)) {
        return item;
      }
    }
  }

  remove(element) {
    delete this.cart[element];
    this.render();
    cartCounter.render();
  }

  render(parentElement) {
    parentElement.replaceChildren();
    for (const item of this.cart.getAll()) {
      this.listItem = document.createElement("li");
      this.listItem.textContent = item.title;
      this.listItem.classList.add("cartItem");
      parentElement.append(this.listItem);
      this.subscribe();
    }
  }

  subscribe() {
    this.listItem.addEventListener("click", this.handleClick);
  }

  unsubscribe() {
    this.listItem.removeEventListener("click", this.handleClick);
  }

  handleClick(event) {
    this.remove(event.target.textContent);
  }
}

// Initialization

const cartContent = document.querySelector(".cartContent");

const cart = new Cart();
const menu = new Menu();

menu.add(new Food("Вода", "Напитки"));
menu.add(new Food("Сок", "Напитки"));
menu.add(new Food("Чай", "Напитки"));
menu.add(new Food("Мимоза", "Салаты"));
menu.add(new Food("Оливье", "Салаты"));
menu.add(new Food("Цезарь", "Салаты"));
menu.add(new Food("Пудинг", "Десерты"));
menu.add(new Food("Йогурт", "Десерты"));
menu.add(new Food("Мороженое", "Десерты"));

new MenuView(menu).render(
  document.querySelector(".options"),
  document.querySelector(".selection")
);

const cartIcon = new CartIcon(document.querySelector(".cartIcon"), cart);
cartIcon.subscribe();


const cartCounter = new CartCounter(cart);

const cartList = new CartList(cart);
cartList.render(cartContent);

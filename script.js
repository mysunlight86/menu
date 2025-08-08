const options = document.querySelector(".options");
const selection = document.querySelector(".selection");
const cartArray = [];
const cartContent = document.querySelector(".cartContent");

class Food {
  constructor(title) {
    this.title = title;
    this.handleClick = this.handleClick.bind(this); // ?
  }

  render(parentElement) {
    this.element = document.createElement("li");
    this.element.textContent = this.title;
    this.element.classList.add("item");
    parentElement.append(this.element);
    this.subscribe();
  }

  subscribe() {
    this.element.addEventListener("click", this.handleClick);
  }

  unsubscribe() {
    this.element.removeEventListener('click', this.handleClick)
  }

  handleClick(event) {
    cartArray.push(event.target.textContent);
    cart.render(cartContent);
  }
}

class Category {
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
      this.items[i].render(this.itemsContainer);
    }
  }
}

class Menu {
  constructor(categories) {
    this.categories = categories;
  }

  render(parentElement, itemsContainer) {
    for (let i = 0; i < this.categories.length; i++) {
      this.categories[i].render(parentElement, itemsContainer);
    }
  }
}

class Cart {
  render(parentElement) {
    parentElement.replaceChildren();
    for (let i = 0; i < cartArray.length; i++) {
      this.listItem = document.createElement("li");
      this.listItem.textContent = cartArray[i];
      this.listItem.classList.add("cartItem");
      parentElement.append(this.listItem);
    }
  }
}

const cart = new Cart();

new Menu([
  new Category("Напитки", [new Food("Вода"), new Food("Сок"), new Food("Чай")]),
  new Category("Салаты", [new Food("Мимоза"), new Food("Оливье"), new Food("Цезарь")]),
  new Category("Десерты", [
    new Food("Пудинг"),
    new Food("Йогурт"),
    new Food("Мороженое"),
  ]),
]).render(options, selection);

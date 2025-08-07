const options = document.querySelector(".options");
const selection = document.querySelector(".selection");
const cartArray = [];
const cartContent = document.querySelector(".cartContent");

class Cart {
  render() {
    cartContent.replaceChildren();
    for (let i = 0; i < cartArray.length; i++) {
      this.listItem = document.createElement("li");
      this.listItem.textContent = cartArray[i];
      this.listItem.classList.add("cartItem");
      cartContent.append(this.listItem);
    }
  }
}

class Menu {
  render(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].render();
    }
  }
}

class Category {
  constructor(title) {
    this.title = title;
  }

  render() {
    this.listItem = document.createElement("li");
    this.listItem.textContent = this.title;
    this.listItem.classList.add("option");
    options.append(this.listItem);
    this.subscribe();
  }

  handleClick(category) {
    selection.innerHTML = "";
    for (let i = 0; i < category.length; i++) {
      category[i].render();
    }
  }

  subscribe() {
    if (this.title === "Напитки") {
      this.listItem.addEventListener("click", () => {
        this.handleClick(drinks);
      });
    }

    if (this.title === "Салаты") {
      this.listItem.addEventListener("click", () => {
        this.handleClick(salads);
      });
    }

    if (this.title === "Десерты") {
      this.listItem.addEventListener("click", () => {
        this.handleClick(desserts);
      });
    }
  }
}

class Food {
  constructor(title) {
    this.title = title;
  }

  render() {
    this.listItem = document.createElement("li");
    this.listItem.textContent = this.title;
    this.listItem.classList.add("item");
    selection.append(this.listItem);
    this.subscribe();
  }

  handleClick() {
    cartArray.push(this.title);
    cart.render(cartContent);
  }

  subscribe() {
    this.listItem.addEventListener("click", () => this.handleClick());
  }
}

const categories = [
  new Category("Напитки"),
  new Category("Салаты"),
  new Category("Десерты"),
];

const drinks = [new Food("Вода"), new Food("Сок"), new Food("Чай")];

const salads = [new Food("Мимоза"), new Food("Оливье"), new Food("Цезарь")];

const desserts = [
  new Food("Пудинг"),
  new Food("Йогурт"),
  new Food("Мороженое"),
];

const cart = new Cart();
const menu = new Menu();
menu.render(categories);

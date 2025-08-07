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
      list[i].render(options, selection);
    }
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







class Food {
  constructor(title) {
    this.title = title;
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




const categories = [
  new Category("Напитки", [new Food("Вода"), new Food("Сок"), new Food("Чай")]),
  new Category("Салаты", [new Food("Мимоза"), new Food("Оливье"), new Food("Цезарь")]),
  new Category("Десерты", [
    new Food("Пудинг"),
    new Food("Йогурт"),
    new Food("Мороженое"),
  ]),
];

const cart = new Cart();
const menu = new Menu();
menu.render(categories);

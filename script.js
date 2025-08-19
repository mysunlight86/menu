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

  getProductsByCategory() {
    const categoryProducts = [];
    for (const product of this.products) {
      if (product.category === category) categoryProducts.push(product);
    }
    return categoryProducts;
  }
  
  getAllProducts() {
    return this.products;
  }

  getProductByTitle(title) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].title === title) {
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

  addProductByTitle(title) {
    const product = menu.getProductByTitle(title); // create menu Model;
    if (product) {
      this.add(product);
    }
  }

  removeProductByTitle(title) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].title === title) {
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

class ProductCardView {
  constructor(container) {
    this.container = container;
  }

  render(model) {
    this.element = document.createElement('li');
    this.element.classList.add('item');
    this.container.append(this.element);

    this.element.innerHTML = `
      <img class="foodImage" src=${model.url} alt="Продукт">
      <p class="foodTitle">${model.title}</p>
      <p class="foodPrice">${model.price}</p>
    `;
  }
}

class FoodCardListView {
  constructor(cardsContainer) {
    this.cardsContainer = cardsContainer;
  }

  render(model) {
    for (const item of model) {
      new FoodCardView(this.cardsContainer).render(item);
    }
  }
}

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
    let counterElement = this.element.querySelector('.orderCount');
    if (!counterElement) {
      counterElement = document.createElement('span');
      counterElement.classList.add('orderCount');
      this.element.append(counterElement);
    }
    
    counterElement.textContent = count;
    if (count > 0) {
      counterElement.style.display = 'inline-block';
    } else {
      counterElement.style.display = 'none';
    }
  }
}

class CartListView {
  constructor(parentElement) {
    this.parentElement = parentElement;
  }

  render(model) {
    this.model = model;
    const cartItems = this.model.getAllItemsInCart();
    this.parentElement.replaceChildren();
    for (const item of cartItems) {
      this.listItem = document.createElement('li');
      this.listItem.textContent = item.title;
      this.listItem.classList.add('cartItem');
      this.parentElement.append(this.listItem);
    }

    if (this.model.getCartCount() === 0) {
      this.parentElement.textContent = 'Вы пока ничего не выбрали';
    }
  }
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
    new FoodCardListView(menuItemsElement).render(menuItems);

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
    // console.log(event.target);
    // console.log(event);
    const itemTitle = event.target.textContent.trim();
    this.model.addToCartByTitle(itemTitle);
    cartIconController.render();
    cartListController.render();
  }
}

class CartIconController {
  constructor(model) {
    this.model = model;
  }

  render() {
    new CartIconView(cartIconElement).render(this.model);
    cartIconElement.addEventListener('click', this.handleClick);
  }

  destroy() {
    cartIconElement.removeEventListener('click', this.handleClick);
  }

  toggleVisibility() {
    cartElement.classList.toggle('hidden');
  }

  handleClick = () => {
    this.toggleVisibility();
  };
}

class CartListController {
  constructor(model) {
    this.model = model;
  }

  render() {
    new CartListView(cartElement).render(this.model);
    if (this.model.getCartCount() > 0) {
      const elements = cartElement.getElementsByClassName('cartItem')
      for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', this.handleClick);
      }
    }
  }

  remove(title) {
    this.model.removeFromCartByTitle(title);
    cartIconController.render();
    cartListController.render();
  }

  destroy() {
    const elements = cartElement.getElementsByClassName('cartItem')
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('click', this.handleClick);
    }
  }

  handleClick = (event) => {
    this.remove(event.target.textContent);
  };
}

// Initialization

const categoriesElement = document.querySelector('.categories');
const menuItemsElement = document.querySelector('.menuItems');
const cartIconElement = document.querySelector('.cartIcon');
const cartElement = document.querySelector('.cart');

const menu = new Menu();

menu.add({ title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
menu.add({ title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });

const cart = new Cart();

const menuController = new MenuController(model);
menuController.render();

const cartIconController = new CartIconController(model);
cartIconController.render();

const cartListController = new CartListController(model);
cartListController.render();

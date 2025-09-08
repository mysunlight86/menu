# Model

## Модель

Сейчас модель в одном классе содержит меню (список доступных продуктов) и корзину. У класса есть две причины для изменения. Это нарушает принцип Single Responsibility.

- [x] Разделить модель на Menu и Cart.
- [x] Переименовать элементы меню так, чтобы они назывались одинаково. (Food, Item или Product)

```JavaScript

class Menu {
  products = [];
  add()
  getCategories()
  getProductsByCategory()
  // ...
}

```

## View

У Element есть свойство innerHTML. Нагляднее в него добавлять вёрстку, чем создавать элементы вручную.

- [x] Вместо набора инструкций по созданию элементов использовать шаблон

```JavaScript

element.innerHTML = `
  <img class="foodImage" src=${model.url} alt="Продукт">
  <p class="foodTitle">${model.title}</p>
  <p class="foodPrice">${model.price}</p>`;

```

View должны получать свою модель в конструкторе, а метод `render()` можно оставить без параметра. Он делает так, что в `this.element` появляется DOM элемента, за который отвечает view и в результате работы возвращает `this.element`. Добавление дочерних элементов в DOM можно доверить методу render родительского View.

- [x] Перенести во всех View передачу модели в конструктор
- [x] Перенести во всех View получение this.element в `render()`
- [x] Возвращать из всех `View.render()` `this.element`

```JavaScript

class ProductCardView {
  constructor(product)

  render() {
    this.element = document.createElement('li');
    // render code
    return this.element;
  }
}

class FoodCardListView {
  constructor(productList)

  render() {
    this.element = document.querySelector('.menuItems');
    for (const item of model) {
      const el = new FoodCardView().render(item);
      this.cardsContainer.append(el);
    }
    return this.element
  }
}

```

- [x] Удалить не используемые методы в модели
- [x] Удалить метод `addProductByTitle` в моделе корзины
- [x] Перенести логику в контроллер
- [x] ProductCardListView и CategoriesTabsView должны очистить DOM перед рендером новых элементов
- [x] CartIconView должна работать с DOM иконки (а не счёчика)
- [x] CartListView должна работать с cart в качестве модели
- [x] CartListView.listItem - не нужен, его можно сделать отдельной константой внутри цикла

```JavaScript

class CartIconView {
  constructor(cart) {
    this.cart = cart;
  }

  render() {
    const count = this.cart.getCount();
    const display = count > 0 ? 'inline-block' : 'none';
    this.element = document.querySelector('.cartIcon');
    this.element.innerHTML = `<span class="orderCount" style="display: ${display}">${count}</span>`
    return this.element;
  }
}

```

Модель должна работать с продукатми по ID. Пример:

```JavaScript
menu.add({ id: 1, title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
menu.add({ id: 2, title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
```

В DOM можно сохранить ID с помощью data-атрибутов.

```JavaScript
class ProductCardView {
  render() {
    this.element = document.createElement('li');
    this.element.classList.add('product');
    this.element.dataset.id = this.product.id;
    // остальной код
  }
}

```

Прочитать data-атрибут в обработчике клика

```JavaScript
handleProductClick = (event) => {
  const target = event.target;
  const cardElement = target.closest('[data-id]');
  const rawProductId = cardElement.dataset.id;
  const productId = parseInt(rawProductId, 10);
}
```

```JavaScript
  renderProducts() {
    const menuProducts = this.menu.getProductsByCategory(this.currentCategory);
    this.els = new ProductCardListView(menuProducts).render();
    this.els.addEventListener('click', this.handleProductClick);
  }

  destroyProducts() {
    if (this.els) {
      this.els.removeEventListener('click', this.handleProductClick);
      this.els.replaceChildren();
    }
  }
```

Обработку кликов по карточкам будет делать CartController. Для этого, он подпишется на клик по меню. ProductCardListView создаётся при инициализации и сразу же делает рендер. Это нужно, чтобы у view был `this.element`. Инстанс ProductCardListView передаётся обоим контроллерам (MenuController, CartController). Первый использует ProductCardListView для заполнения карточками. Второй для подписки на событие клика.

Для того, чтобы уменьшить связь контроллеров с DOM, добавим в View метод для подписки на клик.

```JavaScript

// View

onClick(handler) {
  this.element.addEventListener('click', handler);
}

// Controller

render() {
  this.listView.onClick(this.handleClick);
}

```



- [x] Добавить ID к продуктам
- [x] В модель добавить Menu.getProductById(id)
- [x] В контролере меню, в обработчике клика по карточке продукта находить ID продукта
- [x] Для категорий в качестве ID использовать название самой категории
- [x] Обработчик клика по товару и добавление в корзину происходит в контроллере корзины
- [x] Создание CategoriesTabsView происходит при инициализации и передается в MenuController через конструктор
- [x] Обработчик на клик по карточке должен быть подписан на всё меню, учесть клик мимо карточки
- [x] (не обязательно сейчас) обработчик клика по записи в корзине подписывается на весь список корзины
- [x] Сделать новый CartController
- [x] Перенести обработку клика по карточке в CartController
- [x] Добавить onClick тем View, которые поддерживаю обработку клика (меню, категория, иконка корзины, продукт в корзине)

View должна работать с сущностями модели (Model Entity). В нашем случае это Cart, Menu, Product. Получить список продуктов по категории View должна самостоятельно. Пример:

```JavaScript
constructor(menu, category = menu.getCategories()[0]) {
  this.menu = menu;
  this.category = category;
}
```

Пример методов подписки и отписки на событие в View:

```JavaScript
  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
  }

  off(eventType, handler){
    this.element.removeEventListener(eventType, handler);
  }
```

Пример параметров MenuController

```JavaScript
constructor(menu, categoriesTabsView, productCardListView, cartController)
```

Чтобы избежать копирования одниаковых методов в нескольких классах можно вынести их в суперкласс. В примере - класс View.


```JavaScript
class View {
  // Общий метод 1
  on(eventType, handler) {
    this.element.addEventListener(eventType, handler);
  }

  // Общий метод 2
  off(eventType, handler){
    this.element.removeEventListener(eventType, handler);
  }
}


class ProductCardListView extends View {
  constructor(menu, category = menu.getCategories()[0]) {
    super();
    this.menu = menu;
    this.category = category;
  }

  render() {  }
}

class CategoryTabView extends View {
  constructor(category) {
    super();
    this.category = category;
  }

  render() { }
}

```

- [x] Model / Cart сделать метод `removeProduct(id)`
- [x] Привести конструкторы всех View к виду `constructor(modelEntity)`
- [x] MenuController не должен получать в конструктор элементов, только view, model
- [x] Вынести в суперкласс View методы on и off
- [x] Сделать наследование от класса View во всех классах *View

# Шина событий для контроллеров

Интерфейс шины:

```JavaScript
class PubSubBus {
  static subscribe(eventType, handler) { }
  static unsubscribe(eventType, handler) { }
  static publish(eventType, detail) { }
}
```

Для реализации шины можно использовать систему событий DOM

```JavaScript
document.addEventListener(eventType, handler); // подписка
document.removeEventListener(eventType, handler); // отписка
document.dispatchEvent(new CustomEvent(eventType, {detail: {key: value}})) // публикация события
```

Пример отправки события обновления корзины

```JavaScript
class MenuController {
  handleProductClick = (event) => {
    const product = /* find product */;
    if (product) {
      this.cart.add(product);
      PubSubBus.publish('updated.cart');
    }
  }

  // ... other methods
}
```

Пример подписки на событие

```JavaScript
class CartController {
  init() {
    PubSubBus.subscribe('updated.cart', this.handleCartUpdated);
  }

  dispose() {
    PubSubBus.unsubscribe('updated.cart', this.handleCartUpdated);
  }

  handleCartUpdated = () => {
    this.renderIcon();
    this.renderCartList();
  }

  // Other methods
}
```

- [x] Сделать класс шины событий (PubSubBus)
- [x] Использовать PubSubBus для уведомления контроллера корзины о необходимости перерисовать представления (Views).
- [x] Методы init должны быть вызваны при создании контроллера (CartController)
- [x] Убрать ссылку на CartController из MenuController

# Контроллеры

- [x] Использовать модельный класс Store для создание модели всего приложения
- [x] Представлениям (view) корзинки и списку в корзине добавить атрибут data-action с действием по клику
- [x] Переработка CartController по аналогии с MenuController
  - [x] Контроллер больше не занимается render, метод переименован в init
  - [x] Изначальный render происходит в инициализации всей программы
  - [x] Все клики обрабатываются одним handleClick, внутри выбирается действие по data-action
  - [x] Реализовать действия для CartController:
    - [x] удалять элементы из модели корзины и бросать событие updated.cart
    - [x] бросать событие toggled.cart
    - [x] по событию toggled.cart - переключать корзину
    - [x] по событию updated.cart - обновлять view
- [x] Сделать view для hr
- [x] Объединить в композитное view: MenuView, hr, CartIconView, CartListView


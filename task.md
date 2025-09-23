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

# Разбиение программы на файлы

Для экспорта из модуля объектов:

```JavaScript
export class Store {...
```

Для импорта

```JavaScript
import { Store } from './models.mjs'
```

Подключение скрипта в HTML

```HTML
<script type="module" src="app/app.mjs" defer></script>
```

- [x] Разбить программу на модули
  - infrastructure.mjs
  - models.mjs
  - view.mjs
  - controllers.mjs
  - app.mjs

- [x] Сделать AppController, который будет
  - в методе init создавать views, controllers
  - производить инициализацию контроллеров
  - заполнять модель тестовыми данными

# Навигация

1. Все элементы уже описанные в HTML сделали скрытыми.
2. У базового класса View поддержали методы show / hide
3. Сделали ButtonView, отображает кнопку с заданным текстом, data-action, data-id.
4. Все View, у которых элемент создан в HTML заранее должны перенести свой поиск элемента в конструктор `this.element = document.querySelector('.menuProducts');`
5. MainView переименовали в ScreenView, теперь это базовый класс для любого экрана.
6. Под каждый из экранов сделали отдельный View с вёрсткой соответствующего экрана.
7. Сделали контроллер кнопки навигации, он бросает событие в PubSubBus
8. Для каждого из экранов сделали свой контроллер
9. AppController управляет тем, какой экран показать, может вызвать init или dispose контроллеру экрана
10. AppController реагирует на событие навигации

```JavaScript

// Общий код для всех View

show() {
  this.element.classList.remove('hidden');
}

hide() {
  this.element.classList.add('hidden');
}

// Кнопка рисуется так:

export class ButtonView extends View {
  constructor(params = {}) {
    super();
    this.element = document.createElement('button');
    this.element.type = 'button';
    this.element.dataset.action = params.action || '';
    this.element.dataset.id = params.id || '';
    this.element.innerText = params.text || 'Click Me!';
  }

  render() {
    return this.element;
  }
}

// Базовый класс для любого экрана

export class ScreenView extends CompositeView {
  constructor(children) {
    super();
    this.element = document.querySelector('.main');
    this.children = children;
  }

  show() {
    for (const child of this.children) {
      child.show();
    }
  }

  hide() {
    for (const child of this.children) {
      child.hide();
    }
  }
}

// Пример контроллера целого экрана

export class MenuScreenView extends ScreenView {
  // Конструкто получает только модель, остальные элементы строятся
  constructor(store) {

    // Построим все View, которые есть на этом экране,
    // Это похоже на вёрстку экрана
    const productCardListView = new ProductCardListView(store.menu);
    const categoriesTabsView = new CategoriesTabsView(store.menu);
    const menuView = new MenuView([categoriesTabsView, productCardListView]);
    const cartIconView = new CartIconView(store.cart);
    const cartListView = new CartListView(store.cart);
    const hrView = new HrView();
    const orderBtn = new ButtonView({ text: 'Complete Order', action: 'navigate', id: 'OrderScreen' });

    // Базовый класс ожидает массив из Views, которые должны быть на экране
    super([menuView, hrView, cartIconView, cartListView, orderBtn]);

    // Эти View нам понадобятся для создания контроллеров, запишем их в this
    this.store = store;
    this.productCardListView = productCardListView;
    this.categoriesTabsView = categoriesTabsView;
    this.menuView = menuView;
    this.cartIconView = cartIconView;
    this.cartListView = cartListView;
    this.orderBtn = orderBtn;
  }
}

export class OrderScreenView extends ScreenView {
  // Реализация как у MenuScreenView, но только те View, которые должны отображаться на
  // экране корзины
}

// Управление кнопкой

export class NavigateButtonController {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.view.on('click', this.handleClick);
    return this;
  }

  dispose() {
    this.view.off('click', this.handleClick);
  }

  handleClick = (event) => {
    const element = event.target.closest('[data-action]');

    if (!element) return;

    const action = element.dataset.action;
    const id = element.dataset.id;

    if (action === 'navigate') {
      PubSubBus.publish('navigate', id);
    }
  }
}

// Пример контроллера экрана, у каждого из двух экранов есть по такому контроллеру

export class MenuScreenController {
  controllers = [];

  constructor(store, view) {
    this.store = store;
    this.view = view;
  }

  // Метод вызывается при переходе на экран.

  init() {
    this.view.render();
    this.view.show();

    // Создадим контроллер, которые управляют действиями экране меню
    // Для экрана корзины будут созданы другие контроллеры

    this.controllers = [
      new MenuController(this.store, this.view.categoriesTabsView).init(),
      new MenuController(this.store, this.view.productCardListView).init(),
      new CartController(this.store.cart, this.view.cartIconView).init(),
      new CartController(this.store.cart, this.view.cartListView).init(),
      new NavigateButtonController(this.view.orderBtn).init()
    ];

    // Тут нам пришлось скрыть корзину (список) потому-что на экране меню она по-умолчанию скрыта
    // В контроллере оформления заказа - мы так же само её изначально показываем.
    this.view.cartListView.hide();
  }

  // Задача методы - удалить подписки. Он будет вызываться перед тем как перейти на другой экран.

  dispose() {
    for (const child of this.controllers) {
      child.dispose();
    }
    this.controllers = [];
    this.view.hide();
  }
}

// Фрагмет кода конструктора AppController. Так хранится список экранов и какой экран сейчас активен.

this.currentScreen = 'MenuScreen';
this.controllers = {
  MenuScreen: new MenuScreenController(this.store, new MenuScreenView(this.store)),
  OrderScreen: new OrderScreenController(this.store, new OrderScreenView(this.store))
};

// init / dispose вызываются каждый раз при переключении экранов.
// задача - очистить подписки предыдущего экрана и создать подписки нового экрана.

init() {
  const controller = this.controllers[this.currentScreen];
  controller.init();
  PubSubBus.on('navigate', this.handleNavigate);
}

dispose() {
  const controller = this.controllers[this.currentScreen];
  controller.dispose();
  PubSubBus.off('navigate', this.handleNavigate);
}

// Пример метода обработки события по навигации

handleNavigate = (event) => {
  const screen = event.detail;

  if (!this.controllers[screen]) {
    console.log(`Try navigate to unknown screen ${screen}`);
    return;
  }

  this.dispose();
  this.currentScreen = screen;
  this.init();
}

```

# Загрузка данных с сервера

1. Вынести в файл products.json тестовые данные.
2. В инфраструктуре добавить класс для загрузки данных с сервреа.
3. В моделе сделать флаг `loaded` и метод `put` для установки загруженных данных.
4. View: Выбор первой категории происходит при рендере. Потому-что конструкторы работают до загрузки данных и нет из чего выбрать категорию.
5. ScreenView показывает спинер в методе render пока нет данных.
6. MenuScreenController подписывается на событие `loaded.data`, по этому событию происходит `this.view.render();`. Это обновляет экран и отображает загруженные данные.
7. `AppController` загружает данные через инфраструктурный класс и записывает их в модель. Затем бросает событие `loaded.data`.


```JavaScript

// Загрузка данных с сервера
const response = await fetch('./products.json');
const data = await response.json();
return data;

// Render у View

const category = this.category || this.menu.getCategories()[0];
this.children = [];
for (const product of this.menu.getProductsByCategory(category)) {
  this.children.push(new ProductCardView(product));
}
return super.render();

// Render у экрана

  render() {
    super.render(); // создаёт все дочерние view, чтобы можно было на них подписаться

    if (!this.store.loaded) { // срабатывает только если нет данных в моделе
      const el = document.createElement('div');
      el.innerText = 'Loading...';
      this.element.replaceChildren(el); // Заменяет на странице пустые view на спинер
    }

    return this.element;
  }

// AppController, вместо loadSampleData

async loadData() {
  const data = await DataLoader.getProducts();
  this.store.menu.put(data);
  this.store.loaded = true;
  PubSubBus.publish('loaded.data');
}


```



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
- [ ] Обработчик клика по товару и добавление в корзину происходит в контроллере корзины
- [ ] Создание CategoriesTabsView происходит при инициализации и передается в MenuController через конструктор
- [ ] Обработчик на клик по карточке должен быть подписан на всё меню, учесть клик мимо карточки
- [ ] (не обязательно сейчас) обработчик клика по записи в корзине подписывается на весь список корзины
- [ ] Сделать новый CartController
- [ ] Перенести обработку клика по карточке в CartController
- [ ] Добавить onClick тем View, которые поддерживаю обработку клика (меню, категория, иконка корзины, продукт в корзине)

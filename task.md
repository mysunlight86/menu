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
- [ ] ProductCardListView и CategoriesTabsView должны очистить DOM перед рендером новых элементов
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




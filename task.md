# Model

## Модель

Сейчас модель в одном классе содержит меню (список доступных продуктов) и корзину. У класса есть две причины для изменения. Это нарушает принцип Single Responsibility.

- [ ] Разделить модель на Menu и Cart.
- [ ] Переименовать элементы меню так, чтобы они назывались одинаково. (Food, Item или Product)

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

- [ ] Вместо набора инструкций по созданию элементов использовать шаблон

```JavaScript

element.innerHTML = `
  <img class="foodImage" src=${model.url} alt="Продукт">
  <p class="foodTitle">${model.title}</p>
  <p class="foodPrice">${model.price}</p>`;

```

View должны получать свою модель в конструкторе, а метод `render()` можно оставить без параметра. Он делает так, что в `this.element` появляется DOM элемента, за который отвечает view и в результате работы возвращает `this.element`. Добавление дочерних элементов в DOM можно доверить методу render родительского View.

- [ ] Перенести во всех View передачу модели в конструктор
- [ ] Перенести во всех View получение this.element в `render()`
- [ ] Возвращать из всех `View.render()` `this.element`

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

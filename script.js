const categories = ["Напитки", "Салаты", "Десерты"];
const drinks = ["Вода", "Сок", "Чай"];
const salads = ["Мимоза", "Оливье", "Цезарь"];
const desserts = ["Пудинг", "Йогурт", "Мороженое"];
const options = document.querySelector(".options");
const selection = document.querySelector(".selection");
const cart = [];
const cartContent = document.querySelector(".cartContent");

for (let i = 0; i < categories.length; i++) {
  const listItem = document.createElement("li");
  listItem.textContent = categories[i];
  listItem.classList.add("option");
  options.append(listItem);
}

const optionElements = options.querySelectorAll(".option");

function handleDrinksClick() {
  selection.innerHTML = '';
  for (let j = 0; j < drinks.length; j++) {
    const listItem = document.createElement('li');
    listItem.textContent = drinks[j];
    listItem.classList.add('item');
    selection.append(listItem);
  }

  let orderItems = selection.querySelectorAll('.item');

  for (let j = 0; j < drinks.length; j++) {
    orderItems[j].addEventListener('click', function () {
      cart.push(orderItems[j].textContent);
      renderCart();
    });
  }
}

function handleSaladsClick() {
  selection.innerHTML = "";
  for (let j = 0; j < salads.length; j++) {
    const listItem = document.createElement('li');
    listItem.textContent = salads[j];
    listItem.classList.add('item');
    selection.append(listItem);
  }

  orderItems = selection.querySelectorAll('.item');

  for (let j = 0; j < salads.length; j++) {
    orderItems[j].addEventListener('click', function () {
      cart.push(orderItems[j].textContent);
      renderCart();
    });
  }
}

function handleDessertsClick() {
  selection.innerHTML = '';
  for (let j = 0; j < desserts.length; j++) {
    const listItem = document.createElement('li');
    listItem.textContent = desserts[j];
    listItem.classList.add('item');
    selection.append(listItem);
  }

  orderItems = selection.querySelectorAll('.item');

  for (let j = 0; j < desserts.length; j++) {
    orderItems[j].addEventListener('click', function () {
      cart.push(orderItems[j].textContent);
      renderCart();
    });
  }
}

for (let i = 0; i < categories.length; i++) {
  if (categories[i] === 'Напитки') {
    optionElements[i].addEventListener('click', handleDrinksClick);
  }

  if (categories[i] === 'Салаты') {
    optionElements[i].addEventListener('click', handleSaladsClick);
  }

  if (categories[i] === 'Десерты') {
    optionElements[i].addEventListener('click', handleDessertsClick);
  }
}

function renderCart() {
  cartContent.replaceChildren();
  for (let i = 0; i < cart.length; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = cart[i];
    listItem.classList.add('cartItem');
    cartContent.append(listItem);
  }
}

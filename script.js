const ASSORTMENT = ["Напитки", "Салаты", "Десерты"];
const DRINKS = ["Вода", "Сок", "Чай"];
const SALADS = ["Мимоза", "Оливье", "Цезарь"];
const DESSERTS = ["Пудинг", "Йогурт", "Мороженое"];
let container = document.querySelector(".menu");
let options = container.querySelector(".options");
let selection = container.querySelector(".selection");
let basket = [];
let basketContent = document.querySelector(".basketContent");

for (let i = 0; i < ASSORTMENT.length; i++) {
  const listItem = document.createElement("li");
  listItem.textContent = ASSORTMENT[i];
  listItem.classList.add("option");
  options.append(listItem);
}

let optionElements = container.querySelectorAll(".option");
for (let i = 0; i < ASSORTMENT.length; i++) {
  optionElements[i].addEventListener("click", function () {
    selection.innerHTML = "<ul></ul>";
    if (i === 0) {
      for (let j = 0; j < DRINKS.length; j++) {
        const listItem = document.createElement("li");
        listItem.textContent = DRINKS[j];
        listItem.classList.add("item");
        /* listItem.addEventListener('click', function () {
          basket.push(listItem.textContent);
        }); */
        selection.append(listItem);
      }

      let orderItems = container.querySelectorAll(".item");
      for (let j = 0; j < DRINKS.length; j++) {
        orderItems[j].addEventListener("click", function () {
          /* basket.push(orderItems[j].textContent);
          console.log(orderItems[j].textContent);
          console.log(basket); */

          const listItem = document.createElement("li");
          listItem.textContent = orderItems[j].textContent;
          listItem.classList.add("basketItem");
          basketContent.append(listItem);
        });
      }
    }

    if (i === 1) {
      for (let j = 0; j < SALADS.length; j++) {
        const listItem = document.createElement("li");
        listItem.textContent = SALADS[j];
        listItem.classList.add("item");
        selection.append(listItem);
      }

      let orderItems = container.querySelectorAll(".item");
      for (let j = 0; j < SALADS.length; j++) {
        orderItems[j].addEventListener("click", function () {
          // basket.push(orderItems[j].textContent);

          const listItem = document.createElement("li");
          listItem.textContent = orderItems[j].textContent;
          listItem.classList.add("basketItem");
          basketContent.append(listItem);
        });
      }
    }

    if (i === 2) {
      for (let j = 0; j < DESSERTS.length; j++) {
        const listItem = document.createElement("li");
        listItem.textContent = DESSERTS[j];
        listItem.classList.add("item");
        selection.append(listItem);
      }

      let orderItems = container.querySelectorAll(".item");
      for (let j = 0; j < DESSERTS.length; j++) {
        orderItems[j].addEventListener("click", function () {
          //basket.push(orderItems[j].textContent);

          const listItem = document.createElement("li");
          listItem.textContent = orderItems[j].textContent;
          listItem.classList.add("basketItem");
          basketContent.append(listItem);
        });
      }
    }

    return;
  });
}

/* for (let i = 0; i < basket.length; i++) {
  const listItem = document.createElement('li');
  listItem.textContent = basket[i];
  listItem.classList.add('basketItem');
  basketContent.append(listItem);
}

console.log(basket); */

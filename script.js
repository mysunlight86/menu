const ASSORTMENT = ['Напитки', 'Салаты', 'Десерты'];
let container = document.querySelector('.menu');
let options = container.querySelector('.options');

for (let i = 0; i < ASSORTMENT.length; i++) {
  const listItem = document.createElement('li');
  listItem.textContent = ASSORTMENT[i];
  options.append(listItem);
}

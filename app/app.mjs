import { Store } from './models.mjs';
import { ProductCardListView, CategoriesTabsView, MenuView, HrView, CartIconView, CartListView, MainView } from './view.mjs';
import { MenuController,  CartController} from './controllers.mjs';

const store = new Store();

store.menu.add({ id: 1, title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 2, title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 3, title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 4, title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 5, title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 6, title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 7, title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
store.menu.add({ id: 8, title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
store.menu.add({ id: 9, title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });


const productCardListView = new ProductCardListView(store.menu);
const categoriesTabsView = new CategoriesTabsView(store.menu);
const menuView = new MenuView([categoriesTabsView, productCardListView]);
const hrView = new HrView();
const cartIconView = new CartIconView(store.cart);
const cartListView = new CartListView(store.cart);
const mainView = new MainView([menuView, hrView, cartIconView, cartListView]);
mainView.render();

new MenuController(store, categoriesTabsView).init();
new MenuController(store, productCardListView).init();
new CartController(store.cart, cartIconView).init();
new CartController(store.cart, cartListView).init();

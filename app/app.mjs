import { Store } from './models.mjs';
import { ProductCardListView, CategoriesTabsView, MenuView, HrView, CartIconView, CartListView, MainView } from './view.mjs';
import { MenuController,  CartController} from './controllers.mjs';

class AppController {
  store = new Store();
  controllers = [];

  init() {
    this.dispose();
    this.loadSampleData();

    const productCardListView = new ProductCardListView(this.store.menu);
    const categoriesTabsView = new CategoriesTabsView(this.store.menu);
    const menuView = new MenuView([categoriesTabsView, productCardListView]);
    const hrView = new HrView();
    const cartIconView = new CartIconView(this.store.cart);
    const cartListView = new CartListView(this.store.cart);
    const mainView = new MainView([menuView, hrView, cartIconView, cartListView]);
    mainView.render();

    this.controllers = [
      new MenuController(this.store, categoriesTabsView).init(),
      new MenuController(this.store, productCardListView).init(),
      new CartController(this.store.cart, cartIconView).init(),
      new CartController(this.store.cart, cartListView).init()
    ]
  }

  dispose() {
    for (const child of this.controllers) {
      child.dispose();
    }
  }

  loadSampleData() {
    this.store.menu.add({ id: 1, title: 'Сок', category: 'Напитки', price: '1,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 2, title: 'Вода', category: 'Напитки', price: '0,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 3, title: 'Чай', category: 'Напитки', price: '1,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 4, title: 'Мимоза', category: 'Салаты', price: '3,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 5, title: 'Оливье', category: 'Салаты', price: '2,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 6, title: 'Цезарь', category: 'Салаты', price: '1,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 7, title: 'Пудинг', category: 'Десерты', price: '1,5 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 8, title: 'Йогурт', category: 'Десерты', price: '1,0 у.е.', url: './images/food.png' });
    this.store.menu.add({ id: 9, title: 'Мороженое', category: 'Десерты', price: '2,0 у.е.', url: './images/food.png' });
  }
}

new AppController().init();




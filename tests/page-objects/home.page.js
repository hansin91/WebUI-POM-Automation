import { By } from "selenium-webdriver";

class HomePage {
  static pageTitle = By.xpath('//*[@class="title"]');
  static sideNav = By.xpath('//*[@class="bm-item-list"]');
  static sideNavItems = By.className("bm-item menu-item");
  static shoppingCartContainer = By.id("shopping_cart_container");
  static shoppingCartButton = By.xpath('//*[@class="shopping_cart_link"]');
  static SIDE_NAVS = ["All Items", "About", "Logout", "Reset App State"];
  static inventoryList = By.className("inventory_list");
  static inventoryItem = By.className("inventory_item");
}

export default HomePage;

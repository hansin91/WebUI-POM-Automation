import { until } from "selenium-webdriver";
import assert from "assert";
import HomePage from "../page-objects/home.page.js";

class HomePageAction {
  constructor(driver) {
    this.driver = driver;
  }

  async assertTitle() {
    await this.driver.wait(until.elementLocated(HomePage.pageTitle), 5000);
    const title = await this.driver.findElement(HomePage.pageTitle).getText();
    assert.strictEqual(title, "Products");
  }

  async assertSideNav() {
    const sideNav = await this.driver.wait(until.elementLocated(HomePage.sideNav), 5000);
    const navItems = await sideNav.findElements(HomePage.sideNavItems);
    assert.strictEqual(navItems.length, 4);

    const navTexts = await Promise.all(
      navItems.map(async (item) => {
        const text = await this.driver.executeScript(
          "return arguments[0].textContent.trim();",
          item,
        );
        return text;
      }),
    );
    assert.deepStrictEqual(navTexts, HomePage.SIDE_NAVS, "Nav items do not match expected values");
  }

  async assertShoppingCart() {
    const shoppingCartContainer = await this.driver.wait(
      until.elementLocated(HomePage.shoppingCartContainer),
      5000,
    );
    const shoppingCartButton = await shoppingCartContainer.findElement(HomePage.shoppingCartButton);
    const isVisible = await shoppingCartButton.isDisplayed();
    assert.strictEqual(isVisible, true, "Shopping cart link is not visible");
  }

  async assertInventoryItems() {
    const inventoryList = await this.driver.wait(
      until.elementLocated(HomePage.inventoryList),
      5000,
    );
    const inventoryItems = await inventoryList.findElements(HomePage.inventoryItem);
    assert.strictEqual(inventoryItems.length > 0, true, "Product List should be displayed");
  }

  async assertHomePage() {
    await this.assertTitle();
    await this.assertSideNav();
    await this.assertInventoryItems();
    await this.assertShoppingCart();
  }
}

export default HomePageAction;

import { until } from "selenium-webdriver";
import assert from "assert";
import LoginPage from "../page-objects/login.page.js";
import HomePageAction from "./homepage.action.js";

class LoginAction {
  constructor(driver) {
    this.driver = driver;
  }

  async openLoginPage(url) {
    await this.driver.get(url);
  }

  async inputUsername(username) {
    await this.driver.findElement(LoginPage.usernameInput).sendKeys(username);
  }

  async inputPassword(password) {
    await this.driver.findElement(LoginPage.passwordInput).sendKeys(password);
  }

  async clickLogin() {
    await this.driver.findElement(LoginPage.loginButton).click();
  }

  async assertLoginSuccess() {
    await new HomePageAction(this.driver).assertHomePage();
  }

  async assertLoginFailed(expectedErrorMessage) {
    await this.driver.wait(until.elementsLocated(LoginPage.errorMessage), 5000);
    const actualErrorMessage = await this.driver.findElement(LoginPage.errorMessage).getText();
    assert.strictEqual(actualErrorMessage, expectedErrorMessage);
  }
}

export default LoginAction;

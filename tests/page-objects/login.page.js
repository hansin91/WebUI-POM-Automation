import { By } from "selenium-webdriver";

class LoginPage {
  static usernameInput = By.id("user-name");
  static passwordInput = By.id("password");
  static loginButton = By.id("login-button");
  static errorMessage = By.xpath('//h3[@data-test="error"]');
}

export default LoginPage;

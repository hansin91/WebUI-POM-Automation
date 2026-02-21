import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import edge from "selenium-webdriver/edge.js";
import LoginAction from "../actions/login.action.js";
import { compareScreenshot } from "../../helpers/visual-regression.helper.js";

const browsers = ["chrome", "MicrosoftEdge"];
const URL = "https://www.saucedemo.com";

const setupInitialDriver = async (browser, driver) => {
  let options = null;
  if (browser === "chrome") {
    options = new chrome.Options();
    options.addArguments("--headless");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--incognito");
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  } else {
    options = new edge.Options();
    options.addArguments("--headless=new");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--inprivate");
    driver = await new Builder().forBrowser("MicrosoftEdge").setEdgeOptions(options).build();
  }
  return driver;
};

browsers.forEach(async (browser) => {
  let driver;
  let loginAction;
  describe(`Saucedemo on ${browser} Test`, async () => {
    beforeEach(async () => {
      driver = await setupInitialDriver(browser, driver);
      loginAction = new LoginAction(driver);
      await loginAction.openLoginPage(URL);
    });

    afterEach(async () => {
      await driver.quit();
    });

    it("should login successfully", async () => {
      await loginAction.inputUsername("standard_user");
      await loginAction.inputPassword("secret_sauce");
      await loginAction.clickLogin();
      await loginAction.assertLoginSuccess();

      await compareScreenshot(driver, `${browser}_success_login`);
    });

    it("should login with empty username", async () => {
      await loginAction.inputUsername("");
      await loginAction.inputPassword("secret_sauce");
      await loginAction.clickLogin();
      await loginAction.assertLoginFailed("Epic sadface: Username is required");
      await compareScreenshot(driver, `${browser}_login_with_empty_username`);
    });

    it("should login with missing username", async () => {
      await loginAction.inputPassword("secret_sauce");
      await loginAction.clickLogin();
      await loginAction.assertLoginFailed("Epic sadface: Username is required");
      await compareScreenshot(driver, `${browser}_login_with_missing_username`);
    });

    it("should login with empty password", async () => {
      await loginAction.inputUsername("standard_user");
      await loginAction.inputPassword("");
      await loginAction.clickLogin();
      await loginAction.assertLoginFailed("Epic sadface: Password is required");
      await compareScreenshot(driver, `${browser}_login_with_empty_password`);
    });

    it("should login with missing password", async () => {
      await loginAction.inputUsername("standard_user");
      await loginAction.clickLogin();
      await loginAction.assertLoginFailed("Epic sadface: Password is required");
      await compareScreenshot(driver, `${browser}_login_with_missing_password`);
    });

    it("should login with invalid credentials", async () => {
      await loginAction.inputUsername("standard_user2");
      await loginAction.inputPassword("secret_sauce");
      await loginAction.clickLogin();
      await loginAction.assertLoginFailed(
        "Epic sadface: Username and password do not match any user in this service",
      );
      await compareScreenshot(driver, `${browser}_login_with_invalid_credentials`);
    });

    it("should login with locked user", async () => {
      await loginAction.inputUsername("locked_out_user");
      await loginAction.inputPassword("secret_sauce");
      await loginAction.clickLogin();
      await loginAction.assertLoginFailed("Epic sadface: Sorry, this user has been locked out.");
      await compareScreenshot(driver, `${browser}_login_with_locked_user`);
    });
  });
});

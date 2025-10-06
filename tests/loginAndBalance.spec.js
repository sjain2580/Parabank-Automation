const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid'); // For unique usernames
const RegistrationPage = require('../page-objects/RegistrationPage');
const LoginPage = require('../page-objects/LoginPage');
const AccountsOverviewPage = require('../page-objects/AccountsOverviewPage');

// Global variable to store user data for tests that need a pre-registered user
let registeredUser = {};

test.describe('Login and Check Account Balance', () => {

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const registrationPage = new RegistrationPage(page);

    registeredUser = {
      firstName: 'Login',
      lastName: 'User',
      address: '789 Login St',
      city: 'Logincity',
      state: 'LC',
      zipCode: '98765',
      phoneNumber: '999-888-7777',
      ssn: '999-88-7777',
      username: `loginuser_${uuidv4().substring(0, 8)}`,
      password: 'LoginPassword123!',
      confirmPassword: 'LoginPassword123!'
    };

    // Register the user
    await registrationPage.navigateToRegistration();
    await registrationPage.fillRegistrationForm(registeredUser);
    await registrationPage.clickRegister();
    await expect(registrationPage.successTitle).toHaveText(`Welcome ${registeredUser.username}`);

    await expect(registrationPage.successMessage).toHaveText('Your account was created successfully. You are now logged in.');
    // Log out after registration to prepare for login tests
    await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
    await expect(page).toHaveURL(/.*index\.htm/);
    await page.close();
  });


  test('should allow successful login and show account balance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    //await page.pause()
    const accountsOverviewPage = new AccountsOverviewPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login(registeredUser.username, registeredUser.password);

    await expect(page).toHaveURL(/.*overview\.htm/);
    await page.getByRole('link', { name: 'Accounts Overview' }).textContent();
    const totalBalance = await page.locator('b').filter({ hasText: '$' }).textContent();
    console.log(`Total Balance for user ${registeredUser.username}: ${totalBalance}`);

    // Take a screenshot to check the account balance
    await page.screenshot({ path: `test-results/screenshots/account_balance_${registeredUser.username}.png`, fullPage: true });
    console.log(`Screenshot saved to test-results/screenshots/account_balance_${registeredUser.username}.png`);
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('invalid_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('The username and password could not be verified.');
  });

});

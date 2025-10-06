const HomePage = require('./HomePage');
const { expect } = require('@playwright/test');

class LoginPage extends HomePage {
  constructor(page) {
    super(page);
    this.path = 'index.htm';
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.errorMessage = page.locator('p.error');
  }

  async navigateToLogin() {
    await this.navigateTo(this.path);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getLoginErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
}
module.exports = LoginPage;

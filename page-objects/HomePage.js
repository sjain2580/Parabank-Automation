const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://parabank.parasoft.com/parabank/';
    this.errorMessages = page.locator('.error');
    this.paragraphErrorMessages = page.locator('p.error');
  }

  async navigateTo(path = '') {
    const fullUrl = `${this.baseUrl}${path}`;
    await this.page.goto(fullUrl);
    await expect(this.page).toHaveURL(fullUrl);
  }
}

module.exports = HomePage;

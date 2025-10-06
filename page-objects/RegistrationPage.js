const HomePage = require('./HomePage');
const { expect } = require('@playwright/test');

class RegistrationPage extends HomePage {
  constructor(page) {
    super(page);
    this.path = 'register.htm';

    this.firstNameInput = page.locator('[id="customer.firstName"]');
    this.lastNameInput = page.locator('[id="customer.lastName"]');
    this.addressInput = page.locator('[id="customer.address.street"]');
    this.cityInput = page.locator('[id="customer.address.city"]');
    this.stateInput = page.locator('[id="customer.address.state"]');
    this.zipCodeInput = page.locator('[id="customer.address.zipCode"]');
    this.phoneInput = page.locator('[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('[id="customer.ssn"]');
    this.usernameInput = page.locator('[id="customer.username"]');
    this.passwordInput = page.locator('[id="customer.password"]');
    this.confirmPasswordInput = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successTitle = page.locator('h1');
    this.successMessage = page.getByText('Your account was created');
    this.existingUserError = page.locator('[id="customer.username.errors"]');
    this.passwordMismatchError = page.locator('text=Passwords did not match.');
  }

  async navigateToRegistration() {
    await this.navigateTo(this.path);
  }

  async fillRegistrationForm(userData) {
    console.log('Using phoneInput locator:', this.phoneInput);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.addressInput.fill(userData.address);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.zipCodeInput.fill(userData.zipCode);
    await this.phoneInput.fill(userData.phoneNumber);
    await this.ssnInput.fill(userData.ssn);
    await this.usernameInput.fill(userData.username);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.confirmPassword);
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async getRegistrationSuccessTitle() {
    return await this.successTitle.textContent();
  }

  async getRegistrationSuccessMessage() {
    return await this.successMessage.textContent();
  }

  async getUsernameError() {
    await expect(this.existingUserError).toBeVisible();
    return await this.existingUserError.textContent();
  }

  async getPasswordMismatchError() {
    await expect(this.passwordMismatchError).toBeVisible();
    return await this.passwordMismatchError.textContent();
 }

  async getFieldValidationError(fieldName) {
    const locatorMap = {
      'firstName': '[id="customer.firstName.errors"]',
      'lastName': '[id="customer.lastName.errors"]',
      'address': '[id="customer.address.street.errors"]',
      'city': '[id="customer.address.city.errors"]',
      'state': '[id="customer.address.state.errors"]',
      'zipCode': '[id="customer.address.zipCode.errors"]',
      'ssn': '[id="customer.ssn.errors"]',
      'username': '[id="customer.username.errors"]',
      'password': '[id="customer.password.errors"]',
      'confirmPassword': 'text=Password confirmation is required.',
    };
    const errorLocator = this.page.locator(locatorMap[fieldName]);
    await expect(errorLocator).toBeVisible();
    return await errorLocator.textContent();
  }
}
module.exports = RegistrationPage;

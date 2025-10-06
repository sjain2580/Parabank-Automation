const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid'); // For unique usernames
const RegistrationPage = require('../page-objects/RegistrationPage');
const LoginPage = require('../page-objects/LoginPage'); // For pre-registering a user
const AccountsOverviewPage = require('../page-objects/AccountsOverviewPage');

// Helper function to generate unique user data
const generateUniqueUserData = (prefix = 'test') => {
  const uniqueId = uuidv4().substring(0, 8);
  return {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    city: 'Testville',
    state: 'TS',
    zipCode: '12345',
    phoneNumber: '123-456-7890',
    ssn: '123-45-6789',
    username: `${prefix}_${uniqueId}`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };
};

test.describe('Account Registration', () => {

  test('should allow a new user to register successfully with valid unique details', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const userData = generateUniqueUserData('success');
    //await page.pause();
    await registrationPage.navigateToRegistration();
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.clickRegister();
    await expect(page).toHaveURL("https://parabank.parasoft.com/parabank/register.htm");
    await page.getByRole('heading', { name: 'Welcome ${registeredUser.username}'});
    await page.getByText('Your account was created');
    await page.getByRole('link', { name: 'Accounts Overview' });
    await page.getByRole('heading', { name: 'Accounts Overview' });
    await page.getByRole('link', { name: 'Accounts Overview' }).click();
    await page.getByRole('cell', { name: '$' }).first();
    await page.getByText('Total');
    await page.getByRole('cell', { name: '$' }).nth(2);
    await page.getByRole('cell', { name: '*Balance includes deposits' });

  });

  test('should show error when registering with an existing username', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page); // Use LoginPage to log out after pre-registration
    const existingUserData = generateUniqueUserData('existing');

    // Pre-register a user for this scenario
    await registrationPage.navigateToRegistration();
    await registrationPage.fillRegistrationForm(existingUserData);
    await registrationPage.clickRegister();
    await page.getByRole('heading', { name: `Welcome ${existingUserData.username}` }).textContent();
    // Log out so the next registration attempt can be fresh
    await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
    await expect(page).toHaveURL(/.*index\.htm/); // Back to login page

    // Attempt to register with the same username
    await registrationPage.navigateToRegistration();
    await registrationPage.fillRegistrationForm(existingUserData); // Use same username
    await registrationPage.clickRegister();

    await expect(registrationPage.existingUserError).toBeVisible();
    await expect(registrationPage.existingUserError).toHaveText('This username already exists.');
  });

  test('should show error when passwords do not match', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const userData = generateUniqueUserData('mismatch');
    userData.confirmPassword = 'MismatchedPassword!'; // Intentionally create mismatch

    await registrationPage.navigateToRegistration();
    await registrationPage.fillRegistrationForm(userData);
    await registrationPage.clickRegister();

    await expect(registrationPage.passwordMismatchError).toBeVisible();
    await expect(registrationPage.passwordMismatchError).toHaveText('Passwords did not match.');
  });

  const emptyFields = [
    { field: 'firstName', errorMessage: 'First name is required.' },
    { field: 'lastName', errorMessage: 'Last name is required.' },
    { field: 'address', errorMessage: 'Address is required.' },
    { field: 'city', errorMessage: 'City is required.' },
    { field: 'state', errorMessage: 'State is required.' },
    { field: 'zipCode', errorMessage: 'Zip Code is required.' },
    { field: 'ssn', errorMessage: 'Social Security Number is required.' },
    { field: 'username', errorMessage: 'Username is required.' },
    { field: 'password', errorMessage: 'Password is required.' },
    { field: 'confirmPassword', errorMessage: 'Password confirmation is required.' },
  ];

  for (const { field, errorMessage } of emptyFields) {
    test(`should show validation error for empty ${field}`, async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      await registrationPage.navigateToRegistration();
      await registrationPage.clickRegister();

      const actualErrorMessage = await registrationPage.getFieldValidationError(field);
      expect(actualErrorMessage).toContain(errorMessage);
    });
  }

});

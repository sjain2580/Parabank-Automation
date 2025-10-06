const HomePage = require('./HomePage');
const { expect } = require('@playwright/test');

class AccountsOverviewPage extends HomePage {
  constructor(page) {
    super(page);
    this.path = 'overview.htm';
  }
}
module.exports = AccountsOverviewPage;

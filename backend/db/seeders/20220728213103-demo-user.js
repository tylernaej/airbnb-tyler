'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Demo',
        lastName: 'Lition',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Faker',
        lastName: 'Daker',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Fibber',
        lastName: 'Dibber',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Tyler',
        lastName: 'Jean',
        email: 'tylerjean1@mmail.com',
        username: 'tylernaej',
        hashedPassword: bcrypt.hashSync('doesthiscount?')
      },
      {
        firstName: 'Joe',
        lastName: 'Schmo',
        email: 'joeSchmo@user.io',
        username: 'jscmho',
        hashedPassword: bcrypt.hashSync('4drowssap')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
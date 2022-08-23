'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'DemoUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User1',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User3',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User3',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User4',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password')
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
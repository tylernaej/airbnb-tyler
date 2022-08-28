'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Carl',
        lastName: 'User',
        email: 'carlUser@user.io',
        username: 'carlUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Amanda',
        lastName: 'User',
        email: 'amandaUser@user.io',
        username: 'amandaUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Pat',
        lastName: 'User',
        email: 'patUser@user.io',
        username: 'patUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Natalie',
        lastName: 'User',
        email: 'natalieUser@user.io',
        username: 'natalieUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jared',
        lastName: 'User',
        email: 'jaredUser@user.io',
        username: 'jaredUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Image',
        lastName: 'Image',
        email: 'Image@user.io',
        username: 'Image',
        hashedPassword: bcrypt.hashSync('Image')
      },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demoUser@user.io',
        username: 'demoUser',
        hashedPassword: bcrypt.hashSync('password')
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 1,
        startDate: '2022-10-22',
        endDate: '2022-10-27'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2022-11-22',
        endDate: '2022-11-30'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2022-11-15',
        endDate: '2022-12-30'
      },
      {
        spotId: 4,
        userId: 5,
        startDate: '2022-12-29',
        endDate: '2023-01-07'
      },
      {
        spotId: 2,
        userId: 4,
        startDate: '2022-10-22',
        endDate: '2022-10-24'
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.bulkDelete('Bookings', null, {});
    
  }
};

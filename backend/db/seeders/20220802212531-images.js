'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Images', [
      {
        url: "notsosurewhattoput",
        previewImage: true,
        spotId: 3,
        reviewId: 1,
        userId: 2
      }, 
      {
        url: "notsosurewhattoput",
        previewImage: false,
        spotId: 4,
        reviewId: 2,
        userId: 1
      },
      {
        url: "notsosurewhattoput",
        previewImage: true,
        spotId: 2,
        reviewId: 3,
        userId: 5
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  }
};

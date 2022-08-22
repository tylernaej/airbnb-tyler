'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Images', [
      {
        url: 'https://i.insider.com/5f5b7fdc7ed0ee001e25ebec?width=1000&format=jpeg&auto=webp',
        previewImage: true,
        spotId: 3,
        reviewId: 1,
        userId: 2
      }, 
      {
        url: "https://www.jonesaroundtheworld.com/wp-content/uploads/2020/12/Vacation-Rental-New-Hampshire.jpg",
        previewImage: false,
        spotId: 4,
        reviewId: 2,
        userId: 1
      },
      {
        url: "https://www.jonesaroundtheworld.com/wp-content/uploads/2020/11/Luxury-New-Hampshire-Airbnb.jpg",
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

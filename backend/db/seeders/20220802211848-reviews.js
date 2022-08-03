'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        review: "Best place in town. Can't wait to come back",
        stars: 9,
        userId: 2,
        spotId: 1
      },
      {
        review: "The WORST!!! Never have I ever...",
        stars: 1,
        userId: 3,
        spotId: 3
      },
      {
        review: "BRRRR.. BEEEP.. BOOP.. 1000110111010011",
        stars: 7,
        userId: 1,
        spotId: 4
      },
      {
        review: "Come for the views, stay for the burgers!",
        stars: 8,
        userId: 4,
        spotId: 2
      },
      {
        review: "Just stayed with my family. 5/5",
        stars: 5,
        userId: 5,
        spotId: 1
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Reviews', null, {});

  }
};

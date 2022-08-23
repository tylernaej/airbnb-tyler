'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 1,
        spotId: 1
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 2,
        spotId: 1
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 3,
        spotId: 1
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 4,
        spotId: 1
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 5,
        spotId: 1
      },
      {
        review: "This was a great place to stay",
        stars: 3,
        userId: 2,
        spotId: 2
      },
      {
        review: "This was a great place to stay",
        stars: 2,
        userId: 3,
        spotId: 2
      },
      {
        review: "This was a great place to stay",
        stars: 3,
        userId: 4,
        spotId: 2
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 5,
        spotId: 2
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 1,
        spotId: 2
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 1,
        spotId: 3
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 2,
        spotId: 3
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 3,
        spotId: 3
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 1,
        spotId: 4
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 2,
        spotId: 4
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 3,
        spotId: 4
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 5,
        spotId: 4
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 5,
        spotId: 5
      },
      {
        review: "This was a great place to stay",
        stars: 2,
        userId: 3,
        spotId: 5
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 1,
        spotId: 5
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 1,
        spotId: 6
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 2,
        spotId: 6
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 3,
        spotId: 6
      },
      {
        review: "This was a great place to stay",
        stars: 4,
        userId: 4,
        spotId: 6
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 5,
        spotId: 6
      },
      {
        review: "This was a great place to stay",
        stars: 5,
        userId: 1,
        spotId: 7
      },
      {
        review: "This was a great place to stay",
        stars: 3,
        userId: 3,
        spotId: 7
      },
      {
        review: "This was a great place to stay",
        stars: 3,
        userId: 2,
        spotId: 8
      }  
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Reviews', null, {});

  }
};

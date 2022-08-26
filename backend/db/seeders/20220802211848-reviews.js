'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        review: "1",
        stars: 5,
        userId: 2,
        spotId: 1
      },
      {
        review: "2",
        stars: 4,
        userId: 3,
        spotId: 1
      },
      {
        review: "3",
        stars: 4,
        userId: 4,
        spotId: 1
      },
      {
        review: "4",
        stars: 5,
        userId: 5,
        spotId: 1
      },
      {
        review: "5",
        stars: 2,
        userId: 3,
        spotId: 2
      },
      {
        review: "6",
        stars: 3,
        userId: 4,
        spotId: 2
      },
      {
        review: "7",
        stars: 4,
        userId: 5,
        spotId: 2
      },
      {
        review: "8",
        stars: 4,
        userId: 1,
        spotId: 2
      },
      {
        review: "9",
        stars: 5,
        userId: 1,
        spotId: 3
      },
      {
        review: "10",
        stars: 5,
        userId: 2,
        spotId: 3
      },
      {
        review: "11",
        stars: 4,
        userId: 5,
        spotId: 3
      },
      {
        review: "11",
        stars: 4,
        userId: 1,
        spotId: 4
      },
      {
        review: "12",
        stars: 4,
        userId: 2,
        spotId: 4
      },
      {
        review: "13",
        stars: 4,
        userId: 3,
        spotId: 4
      },
      {
        review: "14",
        stars: 4,
        userId: 5,
        spotId: 4
      },
      {
        review: "15",
        stars: 4,
        userId: 4,
        spotId: 5
      },
      {
        review: "16",
        stars: 2,
        userId: 3,
        spotId: 5
      },
      {
        review: "17",
        stars: 4,
        userId: 1,
        spotId: 5
      },
      {
        review: "18",
        stars: 4,
        userId: 2,
        spotId: 6
      },
      {
        review: "19",
        stars: 5,
        userId: 3,
        spotId: 6
      },
      {
        review: "20",
        stars: 4,
        userId: 4,
        spotId: 6
      },
      {
        review: "21",
        stars: 5,
        userId: 5,
        spotId: 6
      },
      {
        review: "22",
        stars: 5,
        userId: 1,
        spotId: 7
      },
      {
        review: "23",
        stars: 3,
        userId: 3,
        spotId: 7
      },
      {
        review: "24",
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

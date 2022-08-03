'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '123 cool kids road',
        city: 'Coolville',
        state: 'CO',
        country: 'USA',
        lat: 56,
        lng: -120,
        name: "Cool Spot",
        description: "The coolest spot in town. Bring your sunglasses!",
        price: 325,
      },
      {
        ownerId: 2,
        address: '58 Fancy Pants blvd',
        city: 'Bougoisville',
        state: 'NY',
        country: 'USA',
        lat: -50.2,
        lng: 35.25,
        name: 'Fancy Manor',
        description: 'Only the finest and fanciest at Fancy Manor',
        price: 1250,
      },      {
        ownerId: 3,
        address: '2560 whosiewhat street',
        city: 'Peasanttown',
        state: 'NH',
        country: 'USA',
        lat: 85.5,
        lng: -15.3,
        name: 'Peasant Shack',
        description: 'Stay here if you need to. It good enough.',
        price: 120,
      },      {
        ownerId: 3,
        address: '54390 Robo Dr',
        city: 'Beepboopington',
        state: 'CA',
        country: 'USA',
        lat: 23,
        lng: -82,
        name: 'Hipster Robo Getaway',
        description: 'Beep boop... Robots only... beep',
        price: 250,
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};

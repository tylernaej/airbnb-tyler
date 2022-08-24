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
        address: '8537 E. Southampton Drive',
        city: 'Meredith',
        state: 'New Hampshire',
        country: 'United States',
        lat: 43.6575,
        lng: 71.5003,
        name: "Great Lake Winni Waterfront Home",
        description: "Spend a week at 'WeSeekANook' and you'll never want to go home! This awesome water front vacation home on Lake Winnipesaukee has all the charm and modern updates you could wish for. Close to the shops and restaurants in downtown Meredith yet far enough away to escape it all. Completely renovated with a brand new kitchen, bathroom and more, this Pinnacle Park gem offers pristine lake views, a covered porch providing cool shade, private boat dock, and wonderful waterfront for swimming and more! Southern exposure keeps this location under full sun all day. Pinnacle Park is located off Meredith Neck Road and is a wonderful area for families. You can enjoy biking, running and more without the bother of heavy traffic or noisy neighbors.",
        price: 670,
      },
      {
        ownerId: 2,
        address: '83 Glenholme St',
        city: 'Gilford',
        state: 'New Hampshire',
        country: 'United States',
        lat: 43.5476,
        lng: 71.4067,
        name: 'Cabin with Shared Beach',
        description: 'Lovely studio cottage perfect for two!! This waterfront cottage is the simple escape you have been dreaming about. Share this special space with someone you love (or just like a whole bunch).',
        price: 194,
      },      {
        ownerId: 3,
        address: '405 Addison Dr',
        city: 'North Waterboro',
        state: 'Maine',
        country: 'United States',
        lat: 43.6204,
        lng: 70.7343,
        name: 'Cozy and Quiet Cottage on Lake Arrowhead',
        description: 'Enjoy your stay in North Waterboro, Maine on Lake Arrowhead! A perfect destination for adventure seekers and outdoor enthusiasts, this cottage is a great way to explore the waters and woods Southern Maine has to explore.',
        price: 324,
      },      {
        ownerId: 4,
        address: '250 Campfire Street',
        city: 'Newbury',
        state: 'New Hampshire',
        country: 'United States',
        lat: 43.3215,
        lng: 72.0359,
        name: 'Relaxing Sunapee Overwater Cottage',
        description: 'Sunapee Lakefront Cottage with mountain views and dock. Hotel quality mattresses and super-soft, pima cotton sheets. Modern, tastefully decorated, ultra-clean with a ton of sunlight.',
        price: 477,
      },      {
        ownerId: 5,
        address: '14 Richardson St',
        city: 'Salem',
        state: 'New Hampshire',
        country: 'United States',
        lat: 42.7886,
        lng: 71.2009,
        name: 'Quaint Little Lake House Getaway!',
        description: 'Imagine the peace and quiet of looking out a wall of glass seeing the tranquility of the lake while knowing 10 minutes away is shopping, restaurants entertainment and just about anything you could ask for to meet your needs.',
        price: 199,
      },      {
        ownerId: 1,
        address: '7784 Fawn Rd',
        city: 'Hollis',
        state: 'New Hampshire',
        country: 'United States',
        lat: 42.7425,
        lng: 71.5895,
        name: 'Lakefront Nature Getaway - Wood fired Cedar Sauna',
        description: 'Rustic getaway on 280+ft of lakefront & 60 feet from the water with private sauna.',
        price: 291,
      },      {
        ownerId: 2,
        address: '114 Bayberry Street',
        city: 'Barnstead',
        state: 'New Hampshire',
        country: 'United States',
        lat: 43.3389,
        lng: 71.2782,
        name: 'Renovated Waterfront Lake House w/ dock & swim',
        description: 'Our newly renovated waterfront lake house retreat w/ 1500 SF (7 beds), 3BR, 2BA, open concept living room + kitchen + lower level w/ arcade game is the perfect destination for your next getaway.',
        price: 449,
      },      {
        ownerId: 3,
        address: '780 Oak Court',
        city: 'Enfield',
        state: 'New Hampshire',
        country: 'United States',
        lat: 43.6406,
        lng: 72.1440,
        name: 'NEW! Stunning Enfield Home w/ Hot Tub + Boat Dock!',
        description: 'Get a private slice of Lake Mascoma at this spacious and bright 4-bedroom, 4-bathroom home. In the heart of New Hampshires Upper Valley, this Enfield vacation rental boasts sprawling lake views, and a private boat dock.',
        price: 895,
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};

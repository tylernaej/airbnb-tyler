'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        review: "The view is beautiful. Very nice space. There is a lot to do. Highly recommended.",
        stars: 5,
        userId: 2,
        spotId: 1
      },
      {
        review: "This was our first time in New Hampshire and it did not disappoint. We didn’t catch any fish at Todd Lake, but it was more lack of skills than shortage of fish.",
        stars: 4,
        userId: 3,
        spotId: 1
      },
      {
        review: "Absolutely beautiful spot. Lots of room to gather and also have privacy. I will totally recommend this to my friends and family. I hope to come back again.",
        stars: 4,
        userId: 4,
        spotId: 1
      },
      {
        review: "Location and water access was amazing. The property managment company was very available for a few quirky appliance issues.",
        stars: 5,
        userId: 5,
        spotId: 1
      },
      {
        review: "Great view great stay! My only complaint was the place was a little smaller than expected and very cold showers",
        stars: 2,
        userId: 3,
        spotId: 2
      },
      {
        review: "This place awesome for family vacation",
        stars: 3,
        userId: 4,
        spotId: 2
      },
      {
        review: "Our family had an amazing stay on Locke Lake. The house has everything you need - fully stocked kitchen, plenty of lake toys/boats and relaxing views.",
        stars: 4,
        userId: 5,
        spotId: 2
      },
      {
        review: "Fantastic communication. A super smooth process. Fantastic lake views from the deck and great times boating and fishing off the dock.",
        stars: 4,
        userId: 1,
        spotId: 2
      },
      {
        review: "The house was perfect, everything you could possibly need or want was already there! Beautiful location and Carl was great with communicating!",
        stars: 5,
        userId: 1,
        spotId: 3
      },
      {
        review: "Beautiful lakefront location. My son loved the beach area in the backyard so much he didn’t want to leave!",
        stars: 5,
        userId: 2,
        spotId: 3
      },
      {
        review: "Absolutely beautiful house, exactly like the the description!! I booked this as a surprise for my husband, he loved it and so did I!!",
        stars: 4,
        userId: 5,
        spotId: 3
      },
      {
        review: "Thank you for our pleasant stay at your home. Amazing sunset view! Nice updated kitchen.",
        stars: 4,
        userId: 1,
        spotId: 4
      },
      {
        review: "Great home by the lake. We enjoyed the stay.",
        stars: 4,
        userId: 2,
        spotId: 4
      },
      {
        review: "Very responsive and super nice host. House was very clean and had many things within a reasonable drive to do.",
        stars: 4,
        userId: 3,
        spotId: 4
      },
      {
        review: "Beautiful location, clean, cozy, well decorated. Lots to do outside on the water or on the large deck.",
        stars: 4,
        userId: 5,
        spotId: 4
      },
      {
        review: "The host was very responsive and was on top of things right from booking till end of our stay.",
        stars: 4,
        userId: 4,
        spotId: 5
      },
      {
        review: "Overall just okay, but would not stay here again. We had a few maintenance issues with the home and the kitchen was not well equipped.",
        stars: 2,
        userId: 3,
        spotId: 5
      },
      {
        review: "Great weekend getaway and perfect location for the beach and easy drive to Portsmouth!",
        stars: 4,
        userId: 1,
        spotId: 5
      },
      {
        review: "We had a wonderful time at the lake house. The house looks exactly like the pictures and the views are incredible.",
        stars: 4,
        userId: 2,
        spotId: 6
      },
      {
        review: "Beautiful house, and the lake is awesome to canoe, stand in or swim!",
        stars: 5,
        userId: 3,
        spotId: 6
      },
      {
        review: "This is a beautifully updated cottage on a gorgeous lake!",
        stars: 4,
        userId: 4,
        spotId: 6
      },
      {
        review: "This property is absolutely amazing! Plenty of room for sleeping, clean, comfortable and easy to get to, but secluded enough to be private.",
        stars: 5,
        userId: 5,
        spotId: 6
      },
      {
        review: "Great stay near the lake. We enjoyed going out on the kayaks and using the grill out on the back deck.",
        stars: 5,
        userId: 1,
        spotId: 7
      },
      {
        review: "The house is beautifully updated but still has a musty old house smell. ",
        stars: 3,
        userId: 3,
        spotId: 7
      },
      {
        review: "This is a beautiful home in a good location that would benefit from AC and a better cleaning service.",
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

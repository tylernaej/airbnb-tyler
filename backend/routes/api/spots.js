const express = require('express');
const router = express.Router();
const { restoreUser } = require('../../utils/auth');
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');

router.get('/', async(req, res) => {
    const spots = await Spot.findAll({
        attributes: {
            include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
            "avgStarRating"],
        ]},
        include: 
        [
            {model: Review, attributes: []}, 
            {model: Image, attributes: ['url', 'previewImage']},
        ],
        group: ["Spot.id"],
        raw: true
    });
    console.log(spots)
    spots.forEach(spot => {
        if(spot['Images.url']){
            spot.previewImage = spot['Images.url']
        }
        delete spot['Images.url']
        delete spot['Images.previewImage']
    });
    res.status(200)
    res.json(spots)
})

router.get('/current',
    restoreUser,
    async(req, res) => {
        const { user } = req;
        console.log(user.dataValues.id)
        const userSpots = await Spot.findAll({
            attributes: {
                include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                "avgStarRating"],
            ]},
            where: {
                ownerId: user.dataValues.id
            },
            include: [
                {model: Review, attributes: []}
            ]
        })
    res.json(userSpots)
})

router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        attributes: {
            include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
            "avgStarRating"],
            [sequelize.fn("COUNT", sequelize.col("Reviews.stars")),
            "numReviews"
        ]]},
        include: 
        [
            {
                model: Review,                
                group: ['Review.id'],
                include: {
                    model: Image, 
                },
            },
            {
                model: User
            }
        ],
    })
    res.json(spot)
})





module.exports = router;
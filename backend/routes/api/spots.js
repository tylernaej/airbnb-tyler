const express = require('express');
const router = express.Router();
const { restoreUser } = require('../../utils/auth');
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');

router.get('/', async(req, res) => {
    let response = {}
    const spots = await Spot.findAll({
        // raw: true,
        attributes: {
            include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
            "avgStarRating"],
        ]},
        include: 
        [
            {model: Review, attributes: []}, 
            {model: Image, attributes: ['url']},
        ],
        group: ["Spot.id"]
    });
    response.spots = spots
    res.status(200)
    res.json(response)
})

router.get('/current',
    restoreUser,
    async(req, res) => {
        const { user } = req;
        console.log(user.dataValues.id)
        const userSpots = await Spot.findAll({
            where: {
                ownerId: user.dataValues.id
            }
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
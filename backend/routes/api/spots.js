const express = require('express');
const router = express.Router();
const { restoreUser } = require('../../utils/auth');
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');

router.get('/', async(req, res) => {
    const response = {}
    const spots = await Spot.findAll({
        attributes: {
            include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
            "avgRating"],
        ]},
        include: 
        [
            {model: Review, attributes: []}, 
            {model: Image, attributes: ['url', 'previewImage']},
        ],
        group: ["Spot.id"],
        raw: true
    });
    spots.forEach(spot => {
        if(spot['Images.url']){
            spot.previewImage = spot['Images.url']
        }
        delete spot['Images.url']
        delete spot['Images.previewImage']
    });
    response.spots = spots
    res.status(200)
    res.json(response)
})

router.get('/current',
    restoreUser,
    async(req, res) => {
        const { user } = req;
        let response = {}
        const spots = await Spot.findAll({
            attributes: {
                include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                "avgRating"],
            ]},
            where: {
                ownerId: user.dataValues.id
            },
            include: [
                {model: Review, attributes: []},
                {model: Image, attributes: ['url', 'previewImage']},
            ],
            raw: true
        })
        spots.forEach(spot => {
            if(spot['Images.url']){
                spot.previewImage = spot['Images.url']
            }
            delete spot['Images.url']
            delete spot['Images.previewImage']
        });
        response.spots = spots
        res.status(200)
        res.json(response)
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
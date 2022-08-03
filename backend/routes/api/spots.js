const express = require('express');
const router = express.Router();

const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');

router.get('/', async(req, res) => {
    const spots = await Spot.findAll({
        attributes: {
            include: [
                [sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                "avgRating"],
                [sequelize.literal("Images.url"), "previewImage"]
            ]
        },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: Image,
                where: {
                    previewImage: true
                },
                attributes: []
            }
        ]
    })
    res.status(200)
    res.json(spots)
})

router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        attributes: {
            include: [[sequelize.fn("AVG", sequelize.col("Reviews.stars")),
            "avgStarRating"],
            [sequelize.fn("COUNT", sequelize.col("Reviews.stars")),
            "numReviews"
        ]]},
        include: {
            model: Review,
            include: {
                model: User,
                include: {
                    model: Image, 
                },
            }
        }
    })
    res.json(spot)
})





module.exports = router;
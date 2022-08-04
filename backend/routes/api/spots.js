const express = require('express');
const router = express.Router();
// const { restoreUser } = require('../../utils/auth');
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');

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
    requireAuth,
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
            include: [
                [sequelize.fn("COUNT", sequelize.col("Reviews.stars")),
                "numReviews"],
                [sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                "avgRating"]
        ]},
        include: 
        [
            {model: Review, attributes: []},
            {model: Image, attributes: ['id','url']},
            {model: User, attributes: ['id','firstName','lastName']}
        ],
        raw: true
    });
    let imagesArray = [];
    let imagesObject = {};
    let ownerObject = {};

    imagesObject.id = spot['Images.id'];
    imagesObject.imageableId = spot.id ;
    imagesObject.url = spot['Images.url'];
    imagesArray.push(imagesObject);
    spot["Images"]= imagesArray;

    ownerObject.id= spot['User.id']
    ownerObject.firstName= spot['User.firstName']
    ownerObject.lastName= spot['User.lastName']
    spot['Owner']= ownerObject

    delete spot['Images.id']
    delete spot['Images.url']
    delete spot['User.id']
    delete spot['User.firstName']
    delete spot['User.lastName']

    res.status(200)
    res.json(spot)
});

router.post('/',
    requireAuth,
    async (req, res) => {

        const { user } = req;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        } = req.body
        const newSpot = Spot.build({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        await newSpot.save();

        res.status(201)
        res.json(newSpot)
    });





module.exports = router;
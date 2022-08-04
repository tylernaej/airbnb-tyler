const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
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

    if(!spot.id) {
        return res.json({
        "message": "Spot couldn't be found",
        "statusCode": 404
    })};
    
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

const validateReview = [
    check('address')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("Spot address must exist and must be more than 2 characters."),
    check('city')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("Spot city must exist and must be more than 2 characters."),
    check('state')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("Spot state must exist and must be more than 2 characters."),
    check('country')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("Spot country must exist and must be more than 2 characters."),
    check('lat')
        .exists({checkFalsy: true})
        .isLength({min:-90, max:90})
        .withMessage("Spot lat must exist and must be between -90 and 90."),
    check('lng')
        .exists({checkFalsy: true})
        .isLength({min:-180, max:180})
        .withMessage("Spot lng must exist and must be between -180 and 180."),
    check('name')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("Spot name must exist and must be more than 2 characters."),
    check('description')
        .exists({checkFalsy: true})
        .withMessage("Spot description must exist and be more than 10 characters."),
    check('price')
        .exists({checkFalsy: true})
        .isInt()
        .withMessage("Spot price must exist and must be an integer."),
    handleValidationErrors
]

router.post('/',
    requireAuth,
    validateReview,
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
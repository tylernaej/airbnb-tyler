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
        ],
        group: ["Spot.id"],
        raw: true
    });

    const images = await Image.findAll({
        where: {
            previewImage: true
        }, 
        attributes: ['id','url','spotId'],
        raw: true
    })

    spots.forEach(spot => {
        images.forEach(image => {
            if(image.spotId === spot.id) {
                spot.previewImage = image.url
            }
        })
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
            ],
            group: ["Spot.id"],
            raw: true
        })

        const images = await Image.findAll({
            where: {
                previewImage: true
            }, 
            attributes: ['id','url','spotId'],
            raw: true
        })

        spots.forEach(spot => {
            images.forEach(image => {
                if(image.spotId === spot.id) {
                    spot.previewImage = image.url
                }
            })
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
        .withMessage("Street address is required"),
    check('city')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("City is required"),
    check('state')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("State is required"),
    check('country')
        .exists({checkFalsy: true})
        .isLength({min: 2})
        .withMessage("Country is required"),
    check('lat')
        .exists({checkFalsy: true})
        .isLength({min:-90, max:90})
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({checkFalsy: true})
        .isLength({min:-180, max:180})
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({checkFalsy: true})
        .isLength({min: 2, max: 50})
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({checkFalsy: true})
        .withMessage("Description is required"),
    check('price')
        .exists({checkFalsy: true})
        .withMessage("Price per day is required"),
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
router.post('/:spotId/images', 
    requireAuth,
    async (req, res) => {
        
        const { user } = req;
        const { url, previewImage} = req.body
        
        const spot = await Spot.findByPk(req.params.spotId)

        if(!spot){
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }
        console.log(spot.id, spot.ownerId, user.id)
        if(spot.ownerId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        if(spot.ownerId === user.id) {
            let response = {}
            
            const newImage = Image.build({
                url,
                previewImage,
                spotId: spot.id,
                reviewId: null,
                userId: user.id
            })
            await newImage.save()

            response.id = newImage.id
            response.imageableId = newImage.spotId
            response.url = newImage.url

            res.status(200)
            res.json(response)
        }
});
router.put('/:spotId',
    requireAuth,
    validateReview,
    async (req, res) => {

        const { user } = req;

        const spot = await Spot.findByPk(req.params.spotId)

        if(!spot) {
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
        
        if(spot.ownerId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }

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

        if(spot.ownerId === user.id){
            spot.address = address,
            spot.city = city,
            spot.state = state,
            spot.country = country,
            spot.lat = lat,
            spot.lng = lng,
            spot.name = name,
            spot.description = description,
            spot.price = price

            await spot.save()
            
            res.status(200)
            res.json(spot)
        }
    }
);
router.delete('/:spotId',
    requireAuth,
    async (req, res) => {

        const { user } = req;
        const spot = await Spot.findByPk(req.params.spotId)

        if(!spot) {
            return res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }

        if(spot.ownerId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }

        if(spot.ownerId === user.id) {
            console.log('--------------------------------------')
            await spot.destroy()
            res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }
    }    
)

module.exports = router;
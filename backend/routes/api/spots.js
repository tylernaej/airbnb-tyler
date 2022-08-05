const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');
const review = require('../../db/models/review');

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
    let response = {}
    let responseArray = []

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
        ],
        group: ["Spot.id"],
        raw: true
    });

    if(!spot) {
        res.status(404)
        res.json({
        "message": "Spot couldn't be found",
        "statusCode": 404
    })};
    
    const images = await Image.findAll({
        where: {
            spotId: spot.id
        },
        attributes: ['id','url'],
        raw: true
    })
    
    images.forEach(image => {
        image.imageableId = spot.id
    })
    spot['Images'] = images;

    const owner = await User.findByPk(spot['ownerId'], {
        attributes: ['id','firstName','lastName'],
        raw: true
    })
    spot['Owner'] = owner

    res.status(200)
    res.json(spot)
});
const validateSpot = [
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
    validateSpot,
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
            res.status(404)
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
    validateSpot,
    async (req, res) => {

        const { user } = req;

        const spot = await Spot.findByPk(req.params.spotId)

        if(!spot) {
            res.status(404)
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
            res.status(404)
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

        if(spot.ownerId === user.id) {
            await spot.destroy()
            res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }
    }    
)
router.get('/:spotId/reviews', async (req, res) => {
    let response = {}
    
    const spot = await Spot.findByPk(req.params.spotId)
    if(!spot){
        res.status(404);
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }

    const reviews = await Review.findAll({
        where:{
            spotId: req.params.spotId
        },
        raw: true
    })

    const users = await User.findAll({
        attributes: ['id','firstName','lastName'],
        raw: true
    })
    reviews.forEach(review => {
        for(let i = 0; i < users.length; i++) {
            if(review['userId'] === users[i].id){
                review['User'] = users[i]
            }
        }
    })

    const images = await Image.findAll({
        attributes: ['id','reviewId','url'],
        raw: true
    })  
    reviews.forEach(review => {
        for(let i = 0; i < images.length; i++) {
            if(review['id'] === images[i].reviewId){
                let imageObject = {}
                imageObject['id'] = images[i].id
                imageObject['imageableId'] = review['id']
                imageObject['url'] = images[i].url
                console.log(imageObject)
                review['Images'] = imageObject               
            }
        }
    })  

    response['Reviews'] = reviews
    res.status(200)
    res.json(response)
})
const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy: true})
        .isInt({min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]
router.post('/:spotId/reviews',
    requireAuth,
    validateReview,
    async (req, res) => {

        const { user } = req;

        const spot = await Spot.findByPk(req.params.spotId)

        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }

        const spotReviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            raw: true
        })

        spotReviews.forEach(review =>{
            if(review.userId === user.id){
                res.status(403)
                return res.json({
                    "message": "User already has a review for this spot",
                    "statusCode": 403
                  })
            }
            console.log(review.id)
        })

        const {
            review,
            stars
        } = req.body

        const newReview = Review.build({
            review,
            stars,
            userId: user.id,
            spotId: spot.id
        })
        
        await newReview.save()
        res.status(200)
        res.json(spotReviews)
    }
)
router.get('/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        
        let response = {}
        const { user } = req

        const spot = await Spot.findByPk(req.params.spotId, {raw: true})
        const users = await User.findAll({raw: true})

        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }

        const bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            raw: true
        })

        if(user.id !== spot['ownerId']){
            bookings.forEach(booking => {
                delete booking['id']
                delete booking['userId']
                delete booking['createdAt']
                delete booking['updatedAt']
            })
            response['Bookings'] = bookings
        }

        if(user.id === spot['ownerId']){
            bookings.forEach(booking => {
                let bookingInfo = []
                for(let i = 0; i < users.length; i++){
                    if(booking['userId'] === users[i].id){
                        let userObject = {}
                        delete users[i].username
                        userObject['User'] = users[i]
                        bookingInfo.push(userObject)
                        bookingInfo.push(booking)
                    }
                }
                response['Bookings'] = bookingInfo
            })
        }
        res.status(200)
        res.send(response)
    }
)

module.exports = router;
const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');
const review = require('../../db/models/review');
const { Op } = require('sequelize')

router.get('/', async(req, res) => {
    
    const response = {}
    const where = {}

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    
    if(minLat) where['lat'] = {[Op.gt]: minLat}
    if(maxLat) where['lat'] = {[Op.lt]: maxLat}
    if(minLng) where['lng'] = {[Op.gt]: minLng}
    if(maxLng) where['lng'] = {[Op.lt]: maxLng}
    if(minPrice) where['price'] = {[Op.gt]: minPrice}
    if(maxPrice) where['price'] = {[Op.lt]: maxPrice}

    page = parseInt(page);
    size = parseInt(size);
  
    if (Number.isNaN(page)) page = 0;
    if (Number.isNaN(size)) size = 20;
    if (minPrice < 0) minPrice = 0;
    if (maxPrice < 0) maxPrice = 0

    const pagination = {}

    if (page >= 1 && size === 0){
        size = 20
    }
    if (page >= 1 && size >= 1) {
        pagination.limit = size
        pagination.offset = size * (page-1)
    }

    const spots = await Spot.findAll({
        where,
        raw: true,
        ...pagination
    });

    const reviews = await Review.findAll({raw:true})

    spots.forEach(spot => {
        let spotRatings = 0
        let count = 0
        for (let i = 0; i < reviews.length; i++){
            console.log(spot.id, reviews[i].spotId)
            if(spot.id === reviews[i].spotId) {
                spotRatings += reviews[i].stars 
                count++
            }
        }
        console.log(spotRatings,count)
        if(spotRatings > 0) {
            spot['avgRating'] = spotRatings/count
        }
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

        const spotReviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            },
            raw: true
        })

        let reviewConflict = false
        spotReviews.forEach(review =>{
            if(review.userId === user.id){
                reviewConflict = true
                res.status(403)
                return res.json({
                    "message": "User already has a review for this spot",
                    "statusCode": 403
                  })
            }
        })

        const spot = await Spot.findByPk(req.params.spotId)

        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }

        const {
            review,
            stars
        } = req.body

        let newReview
        if(!reviewConflict){
            newReview = Review.build({
                review,
                stars,
                userId: user.id,
                spotId: spot.id
            })
            await newReview.save()
        }

        res.status(200)
        res.json(newReview)
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
const validateBooking = [
    check('startDate')
        .exists({checkFalsy: true})
        .withMessage('startDate must exist'),
    check('endDate')
        .exists({checkFalsy: true})
        .custom((value, { req }) => {
            if(new Date(value) <= new Date(req.body.startDate)) {
                throw new Error;
            }
            return true;
        })
        .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
]
router.post('/:spotId/bookings',
    requireAuth,
    validateBooking,
    async (req, res) => {

        //getting active user from requireAuth
        const { user } = req
        //get spot to create the booking for
        const spot = await Spot.findByPk(req.params.spotId, {raw: true})
        //check to see if spotId is valid
        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
        //check to see if the active user is booking the spot they own
        if(spot.ownerId === user.id){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
            })
        }
        //finds all the active bookings for the spot.
        const existingSpotBookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            raw: true
        })
        //getting the info from the user about when they would like to book the spot.
        const {
            startDate,
            endDate
        } = req.body
        //checks all active bookings, and it there is an active booking during the dates the user wants to book,
        //it will return an error.
        let bookingConflict = false

        existingSpotBookings.forEach(existingBooking => {
            let startDateParsed = Date.parse(startDate)
            let endDateParsed = Date.parse(endDate)
            let existingStartDateParsed = Date.parse(existingBooking.startDate)
            let existingEndDateParsed = Date.parse(existingBooking.endDate)
            if(
                (startDateParsed >= existingStartDateParsed && 
                startDateParsed <= existingEndDateParsed) ||
                (endDateParsed >= existingStartDateParsed &&
                endDateParsed <= existingEndDateParsed)
                ) {
                    bookingConflict = true
                    res.status(403)
                    res.json({
                        "message": "Sorry, this spot is already booked for the specified dates",
                        "statusCode": 403,
                        "errors": {
                            "startDate": "Start date conflicts with an existing booking",
                            "endDate": "End date conflicts with an existing booking"
                        }
                    })
                }
            })
            //if there is not booking conflict, create a new booking for the user submitted dates.
            let newBooking
            if(!bookingConflict)  {
                newBooking = Booking.build({
                    spotId: spot.id,
                    userId: user.id,
                    startDate,
                    endDate
                })
                //save the booking in the db
                await newBooking.save()
            }      
        //return the confirmed booking info back to the user.
        res.status(200)
        res.json(newBooking)
    }
)

module.exports = router;
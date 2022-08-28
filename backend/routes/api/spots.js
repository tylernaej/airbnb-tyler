const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');
const review = require('../../db/models/review');
const { Op } = require('sequelize')

//get all spots
router.get('/', async(req, res) => {
    //prep a response object
    const response = {}
    //prep a where object for using req.query 
    const where = {}
    //pull all the search params out of req.query
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    //check to see if the search params exist, and if they do, format that
    //correctly and add it to the where object to be passed into
    //the spots.findAll later
    if(minLat) where['lat'] = {[Op.gt]: minLat}
    if(maxLat) where['lat'] = {[Op.lt]: maxLat}
    if(minLng) where['lng'] = {[Op.gt]: minLng}
    if(maxLng) where['lng'] = {[Op.lt]: maxLng}
    if(minPrice) where['price'] = {[Op.gt]: minPrice}
    if(maxPrice) where['price'] = {[Op.lt]: maxPrice}
    //parse the page and size values
    page = parseInt(page);
    size = parseInt(size);
    //if the page and size aren't valid values, set a default value.
    if (Number.isNaN(page)) page = 0;
    if (Number.isNaN(size)) size = 20;
    if (minPrice < 0) minPrice = 0;
    if (maxPrice < 0) maxPrice = 0
    //create pagination object
    const pagination = {}
    //set the size object to 20 if it was set to 0
    if (page >= 1 && size === 0){
        size = 20
    }
    //create the limit and offset for the pagination object
    if (page >= 1 && size >= 1) {
        pagination.limit = size
        pagination.offset = size * (page-1)
    }
    //find all the spots, passing in the where and pagination objects
    const spots = await Spot.findAll({
        where,
        raw: true,
        ...pagination
    });
    //get all the reviews
    const reviews = await Review.findAll({raw:true})
    //for each spot, check all the reviews - count the number of reviews
    //associated to that spot and keep track of what the average is 
    //for all of the reviews associated to that spot. 
    spots.forEach(spot => {
        let spotRatings = 0
        let count = 0
        for (let i = 0; i < reviews.length; i++){
            if(spot.id === reviews[i].spotId) {
                spotRatings += reviews[i].stars 
                count++
            }
        }
        //if there were any reviews, add the average rating to the spot
        if(spotRatings > 0) {
            spot['avgRating'] = parseFloat((spotRatings/count).toFixed(1))
        }
    })
    //grab all the image info where the image is considered a 
    //preview image
    const images = await Image.findAll({
        where: {
            previewImage: true
        }, 
        attributes: ['id','url','spotId'],
        raw: true
    })
    //check each spot to see if there is an associated preview image,
    //then add the url of that image to the spot for use.
    spots.forEach(spot => {
        images.forEach(image => {
            if(image.spotId === spot.id) {
                spot.previewImage = image.url
            }
        })
    });
    //add the array of spots as a key/value pair to the response object
    response.spots = spots
    res.status(200)
    res.json(response)
})
//get spots of the current user
router.get('/current',
    requireAuth,
    async(req, res) => {
        //get use info from req
        const { user } = req;
        //prepare a response object to populate
        let response = {}
        //get all the spots where the active user is the owner,
        //add an average rating column to the spots.
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
        //get all the images that are preview images
        const images = await Image.findAll({
            where: {
                previewImage: true
            }, 
            attributes: ['id','url','spotId'],
            raw: true
        })
        //for each spot, check if there is a preview image associated,
        //if there is, add it to the spot info
        spots.forEach(spot => {
            images.forEach(image => {
                if(image.spotId === spot.id) {
                    spot.previewImage = image.url
                }
            })
        });
        //add all the spots to the response object as an key/value
        //pair where the spots are an array to the key 'Spots'
        response.spots = spots
        res.status(200)
        res.json(response)
})
//get spot by id
router.get('/:spotId', async(req, res) => {
    //get the spot by id, create an average rating and number of reviews attribute  
    const spot = await Spot.findByPk(req.params.spotId, {
        // attributes: {
        //     include: [
        //         [sequelize.fn("COUNT", sequelize.col("Reviews.stars")),
        //         "numReviews"],
        //         [sequelize.fn("AVG", sequelize.col("Reviews.stars")),
        //         "avgRating"]
        // ]},
        // include: 
        // [
        //     {model: Review, attributes: []},
        // ],
        group: ["Spot.id"],
        raw: true
    });
    //if the spotId was invalid, send an error message
    if(!spot) {
        res.status(404)
        res.json({
        "message": "Spot couldn't be found",
        "statusCode": 404
    })};
    //get all of the images associated to the spot
    const reviews = await Review.findAll({
        where: {
            spotId: spot.id
        },
        raw:true
    })

    let spotRatings = 0
    let count = 0

    if(reviews.length === 0) spot['avgRating'] = 5

    if(reviews.length > 0) {
        for (let i = 0; i < reviews.length; i++){
            if(spot.id === reviews[i].spotId) {
                spotRatings += reviews[i].stars 
                count++
            }
        }
        if(spotRatings > 0) {
            spot['avgRating'] = parseFloat((spotRatings/count).toFixed(1))
        }
    }

    if(reviews.length === 0) spot['numReviews'] = 0

    if(reviews.length > 0) {
        spot['numReviews'] = reviews.length
    }

    const images = await Image.findAll({
        where: {
            spotId: spot.id
        },
        attributes: ['id','url'],
        raw: true
    })
    //attach the spotId to each image as imageableId
    images.forEach(image => {
        image.imageableId = spot.id
    })
    //add the array of images as a key/value pair to the spot
    spot['Images'] = images;
    //get the owner of the spot and add their info to the spot
    const owner = await User.findByPk(spot['ownerId'], {
        attributes: ['id','firstName','lastName'],
        raw: true
    })
    spot['Owner'] = owner

    spot.avgRating = parseFloat(spot.avgRating.toFixed(1))

    res.status(200)
    res.json(spot)
});
//spot validation
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
//create a new spot
router.post('/',
    requireAuth,
    validateSpot,
    async (req, res) => {
        //get user and newSpot info from req
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
            price,
        } = req.body
        //build a new spot with the info submitted
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
//create a Preview image for a spot
router.post('/:spotId/images', 
    requireAuth,
    async (req, res) => {
        //grab the user info and new image info from req
        const { user } = req;
        const { url, previewImage} = req.body
        //grab the spot and check if it exists
        const spot = await Spot.findByPk(req.params.spotId)
        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }
        //validate ownership and if not owner, send error
        if(spot.ownerId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //if active user is owner, prep a response obejct and create
        //a new image with the image info provided. Because this is
        //an image for a spot, reviewId is null
        let response = {}
        if(spot.ownerId === user.id) {
            
            const newImage = Image.build({
                url,
                previewImage,
                spotId: spot.id,
                reviewId: null,
                userId: user.id
            })
            await newImage.save()

            //add image info into response object to send
            response.id = newImage.id
            response.imageableId = newImage.spotId
            response.url = newImage.url

            res.status(200)
            res.json(response)
        }
});
//update a spot
router.put('/:spotId',
    requireAuth,
    validateSpot,
    async (req, res) => {
        //get the user info from req
        const { user } = req;
        //grab the spot and check if it is a valid id
        const spot = await Spot.findByPk(req.params.spotId)
        if(!spot) {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
        //validate ownership and send error if not owner
        if(spot.ownerId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //get submitted info for edit of spot
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
        //if the owner is the active user, edit the spot info
        //with the new info submitted by the owner, save and send
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
//delete a spot by id
router.delete('/:spotId',
    requireAuth,
    async (req, res) => {
        //get the user info from req
        const { user } = req;
        //get the spot by id and send error if doesn't exist
        const spot = await Spot.findByPk(req.params.spotId)
        if(!spot) {
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
            })
        }
        //validate ownership and send error if not owner
        if(spot.ownerId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //validate ownership and if owner, delete spot
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
//get all the reviews of a spot by id
router.get('/:spotId/reviews', async (req, res) => {
    //create a response object to populate
    let response = {}
    //get the spot by id and send error if there is no such spot.
    const spot = await Spot.findByPk(req.params.spotId)
    if(!spot){
        res.status(404);
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    //get all the reviews associated to the spot
    const reviews = await Review.findAll({
        where:{
            spotId: req.params.spotId
        },
        raw: true
    })
    //get all users info, then check each review to add the user info 
    //to that review.
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
    //get all image info, then check each review to add the image 
    //info to that review
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
                review['Images'] = imageObject               
            }
        }
    })  
    //add all the review info to the response object and 
    //give it a key of 'Reviews'
    response['Reviews'] = reviews
    res.status(200)
    res.json(response)
})
//review validation
const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy: true})
        .isIn([1,2,3,4,5])
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]
//create a new review for a spot
router.post('/:spotId/reviews',
    requireAuth,
    validateReview,
    async (req, res) => {

        //get user info from req
        const { user } = req;
        //get all the reviews associated to the spot Id
        const spotReviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            },
            raw: true
        })
        //sets a variable switch outside of loop to use check if a
        //conflict was found. This is to prevent a user from making
        //multiple reviews.
        let reviewConflict = false
        //looks are each spot to check if the user has already submitted
        //a review for that spot; if they have, return an error message and
        //update the reviewConflict variable to true, to indicate later
        //that there should not be a review created. 
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
        //checks to see if the spotId was valid
        const spot = await Spot.findByPk(req.params.spotId)
        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }
        //if the spotId was valid and the user does not already have
        //a review, create one and save it.
        const {
            review,
            stars
        } = req.body
        //new review declared outside of if to get access to later
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
        //send newReview if one is created
        res.status(200)
        res.json(newReview)
    }
)
//get all the bookings of a spot
router.get('/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        //prep response object to add to    
        let response = {}
        //get user info from req
        const { user } = req
        //get the spot by id and get all users
        const spot = await Spot.findByPk(req.params.spotId, {raw: true})
        const users = await User.findAll({raw: true})
        //if spot Id was invalid, send error
        if(!spot){
            res.status(404)
            res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              })
        }
        //get all bookings from the active spot
        const bookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            raw: true
        })
        //check to see if is user is the owner of the spot
        //if not, the user will see a limited view of the bookings
        //associated to that spot, so details are deleted prior
        //to being added to the response object.
        if(user.id !== spot['ownerId']){
            bookings.forEach(booking => {
                delete booking['id']
                delete booking['userId']
                delete booking['createdAt']
                delete booking['updatedAt']
            })
            //add the new edited bookings to the response object
            response['Bookings'] = bookings
        }
        //checks to see if the active user is the owner of the spot,
        //then adds details to the each booking before adding 
        //the bookings to the response object.
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
        //send response object
        res.status(200)
        res.send(response)
    }
)
//booking validation
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
//create a booking for a spot by id
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
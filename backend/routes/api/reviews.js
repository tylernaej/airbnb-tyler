const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');

//get the current users reviews
router.get('/current',
    requireAuth,
    async (req, res) => {
        //get user from req
        const { user } = req;
        //prep response object for population
        let response = {}
        //grab all the reviews of the active user
        const reviews = await Review.findAll({
            where: {
                userId: user.dataValues.id
            },
            group: ["Review.id"],
            raw: true
        })
        //get the active users information
        const reviewer = await User.findByPk(user.id, {
            attributes: ['id','firstName','lastName'],
            raw: true
        })
        //add the active user information to each review
        reviews.forEach(review => {
            review['User'] = reviewer
        });
        //get spot information
        const spots = await Spot.findAll({
            attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price'],
            raw:true
        })
        //add the associated spot information for each review
        reviews.forEach(review => {
            for(let i = 0; i < spots.length; i++) {
                if(review['spotId'] === spots[i].id){
                    review['Spot'] = spots[i]
                }
            }
        })
        //get all of the required image information
        const images = await Image.findAll({
            attributes: ['id','url','reviewId'],
            raw: true
        })
        //For each review, if are associated images to the review,
        //create an image object and add that to the review
        reviews.forEach(review => {
            for (let i = 0; i < images.length; i++) {
                if(review.id === images[i].reviewId){
                    let imagesObject = {}
                    imagesObject['id'] = images[i].id
                    imagesObject['url'] = images[i].url
                    imagesObject['imageableId'] = images[i].reviewId
                    review['Images'] = imagesObject
                }
            }
        })
        //add all the review information to the response object
        response['Reviews'] = reviews
        res.status(200)
        res.json(response)
    }
);
//create a new image by review id
router.post('/:reviewId/images',
    requireAuth,
    async (req, res) => {
        //get user information from req
        const { user } = req;
        //get review by id, if id is invalid, throw error
        const review = await Review.findByPk(req.params.reviewId)
        if(!review){
            res.status(404)
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
              })
        }
        //grab all the images
        const images = await Image.findAll({raw: true})
        //reviewImages to hold the existing images temporaily while we check
        //to see if there are already 10 images associated to the review
        let reviewImages = []
        //fill up reviewImages with all the images on the review
        images.forEach(image => {
            if(req.params.reviewId === image.reviewId){
                reviewImages.push(image)
            }
        })
        //if there are already 10 or more images, throw error
        if(reviewImages.length > 9) {
            res.status(403);
            res.json({
                "message": "Maximum number of images for this resource was reached",
                "statusCode": 403
              })
        }
        //if the active user is not the reviewer, throw error
        if(review.userId !== user.id){
            res.status(403);
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //get the new image info from req
        const {
            url,
            previewImage
        } = req.body;
        //build new image and save it to db
        const newImage = Image.build({
            url,
            previewImage,
            spotId: review['spotId'],
            reviewId: review.id,
            userId: user.id
        })
        await newImage.save()
        //prep response object, fill with info about the image, and send
        let response= {}
        response['id'] = newImage.id
        response['imageableId'] = review.id
        response['url'] = newImage.url
        res.status(200)
        res.json(response)
    }
)
//update a review by id
router.put('/:reviewId',
    requireAuth,
    async (req, res) => {
        //grab user info from req
        const { user } = req;
        //get review to update, if invalid Id throw error
        const reviewToEdit = await Review.findByPk(req.params.reviewId, {
            // raw: true
        })
        if(!reviewToEdit) {
            res.status(404);
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
              })
        }
        //if the active user is not the reviewer, throw error
        if(reviewToEdit.userId !== user.id){
            res.status(403);
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //get the review update info from req
        const {
            review,
            stars
        } = req.body
        //if the active user is the reviewer, update the review
        if(reviewToEdit.userId === user.id) {
            reviewToEdit.update({
                review: review,
                stars: stars
            })
            // await reviewToEdit.save()
        }
        res.status(200)
        res.json(reviewToEdit)
    }
)
//delete a review by id
router.delete('/:reviewId',
    requireAuth,
    async (req, res) => {
        //get the user from req
        
        const { user } = req
        console.log(`\n\n\n The User is ${user}\n\n\n`)
        console.log(`\n\n\n\ Id to delete', ${req.params.reviewId}, ${typeof req.params.reviewId} \n\n\n`)
        //grab review to delete if invalid Id, throw error
        const reviewToDelete = await Review.findByPk(req.params.reviewId)
        if(!reviewToDelete){
            res.status(404);
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
            })
        }
        //if the active user is not the reviewer, throw error
        if(reviewToDelete.userId !== user.id){
            res.status(403);
            res.json({
                "message": "Forbidden",
                "statusCode": 403
            })
        }
        //if the active user is the reviewer, delete, and send
        //confirmation
        console.log('Review to Delete', reviewToDelete)
        console.log(`\n\n\n UserId, ${typeof user.id} ${user.id} \n\n\n`)
        console.log(`\n\n\n reviewToDelete.userId, ${typeof reviewToDelete.userId} ${reviewToDelete.userId} \n\n\n`)

        const response = await reviewToDelete.destroy()
        console.log(response)
        console.log('review deleted!!!!')
        res.status(200)
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
)

module.exports = router;
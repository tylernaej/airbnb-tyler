const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');


router.get('/current',
    requireAuth,
    async (req, res) => {

        const { user } = req;

        let response = {}
        
        const reviews = await Review.findAll({
            where: {
                userId: user.dataValues.id
            },
            group: ["Review.id"],
            raw: true
        })
       
        const reviewer = await User.findByPk(user.id, {
            attributes: ['id','firstName','lastName'],
            raw: true
        })
        reviews.forEach(review => {
            console.log(review)
            review['User'] = reviewer
        });

        const spots = await Spot.findAll({
            attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price'],
            raw:true
        })
        reviews.forEach(review => {
            for(let i = 0; i < spots.length; i++) {
                if(review['spotId'] === spots[i].id){
                    review['Spot'] = spots[i]
                }
            }
        })

        const images = await Image.findAll({
            attributes: ['id','url','reviewId'],
            raw: true
        })
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

        response['Reviews'] = reviews
        res.statusCode(200)
        res.json(response)
    }
);
router.post('/:reviewId/images',
    requireAuth,
    async (req, res) => {
        
        const { user } = req;

        const review = await Review.findByPk(req.params.reviewId)

        const reviewImages = await Image.findAll({
            where: {
                reviewId: review.id
            },
            raw: true
        })

        if(reviewImages.length > 9) {
            res.statusCode(403);
            res.json({
                "message": "Maximum number of images for this resource was reached",
                "statusCode": 403
              })
        }

        if(review.userId !== user.id){
            res.statusCode(403);
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }

        if(!review){
            res.statusCode(404)
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
              })
        }

        const {
            url,
            previewImage
        } = req.body;

        const newImage = Image.build({
            url,
            previewImage,
            spotId: review['spotId'],
            reviewId: review.id,
            userId: user.id
        })
        await newImage.save()

        let response= {}
        response['id'] = newImage.id
        response['imageableId'] = review.id
        response['url'] = newImage.url

        res.statusCode(200)
        res.json(response)
    }
)
router.put('/:reviewId',
    requireAuth,
    async (req, res) => {

        const { user } = req;

        const reviewToEdit = await Review.findByPk(req.params.reviewId, {
            raw: true
        })

        if(!reviewToEdit) {
            res.statusCode(404);
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
              })
        }

        if(reviewToEdit.userId !== user.id){
            res.statusCode(403);
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }

        const {
            review,
            stars
        } = req.body

        if(reviewToEdit.userId === user.id) {
            reviewToEdit.review = review,
            reviewToEdit.stars = stars
        }

        res.statusCode(200)
        res.json(reviewToEdit)
    }
)
router.delete('/:reviewId',
    requireAuth,
    async (req, res) => {

        const { user } = req

        const reviewToDelete = await Review.findByPk(req.params.reviewId)

        if(!reviewToDelete){
            res.statusCode(404);
            res.json({
                "message": "Review couldn't be found",
                "statusCode": 404
              })
        }

        if(reviewToDelete.userId !== user.id){
            res.statusCode(403);
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        if(reviewToDelete.userId === user.id){
            await reviewToDelete.destroy()
            res.statusCode(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }

    }
)

module.exports = router;
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

        res.send(response)
    }
    )


module.exports = router;
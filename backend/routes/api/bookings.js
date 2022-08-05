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

        const userBookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            group: ['Booking.id'],
            raw: true
        })

        const spots = await Spot.findAll({
            attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price'],
            raw:true
        })

        const images = await Image.findAll({
            attributes: ['id','url','spotId'],
            raw: true
        })

        spots.forEach(spot => {
            for(let i = 0; i < images.length; i++) {
                if(spot.id === images[i].spotId){
                    spot['previewImage'] = images[i].url
                }
            }
        })

        userBookings.forEach(booking => {
            for(let i = 0; i < spots.length; i++) {
                if(booking['spotId'] === spots[i].id) {
                    booking['Spot'] = spots[i]
                }
            }
        });

        let response = {}
        response['Bookings'] = userBookings
        res.status(200)
        res.json(response)
    }
)

module.exports = router;
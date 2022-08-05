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
router.put('/:bookingId',
    requireAuth,
    validateBooking,
    async (req, res) => {

        const { user } = req;

        const booking = await Booking.findByPk(req.params.bookingId)

        if(!booking){
            res.status(404)
            res.json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            })
        }

        if(booking.userId !== user.id){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }

        const {
            startDate,
            endDate
        } = req.body

        if(Date.parse(endDate) < Date.parse(new Date())){
            res.status(403),
            res.json({
                "message": "Past bookings can't be modified",
                "statusCode": 403
              })
        }
        
        const existingSpotBookings = await Booking.findAll({
            where: {
                spotId: booking['spotId']
            },
            raw: true
        })

        existingSpotBookings.forEach(existingBooking => {
            let startDateParsed = Date.parse(startDate)
            let endDateParsed = Date.parse(endDate)
            let existingStartDateParsed = Date.parse(existingBooking.startDate)
            let existingEndDateParsed = Date.parse(existingBooking.endDate)
            if(
                (startDateParsed > existingStartDateParsed && 
                startDateParsed < existingEndDateParsed) ||
                (endDateParsed > existingStartDateParsed &&
                endDateParsed < existingEndDateParsed)
            ) {
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
        
        booking.set({
            startDate: startDate,
            endDate: endDate
        })
        
        await booking.save()

        res.status(200)
        res.json(existingSpotBookings)
    }
)

module.exports = router;
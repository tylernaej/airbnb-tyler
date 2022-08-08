const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');

//get the bookings of the current user
router.get('/current',
    requireAuth,
    async (req, res) => {
        //get the user info from req
        const { user } = req;
        //get all the bookings of the current user
        const userBookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            group: ['Booking.id'],
            raw: true
        })
        //get all the spot info
        const spots = await Spot.findAll({
            attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price'],
            raw:true
        })
        //get all the image info
        const images = await Image.findAll({
            attributes: ['id','url','spotId'],
            raw: true
        })
        //for each spot, check to see if there is an associated preview image
        //and add that to the spot
        spots.forEach(spot => {
            for(let i = 0; i < images.length; i++) {
                if(spot.id === images[i].spotId){
                    spot['previewImage'] = images[i].url
                }
            }
        })
        //for each of the users bookings, check all of the spots to see which
        //spot is associated, then add that associated spot to the booking.
        userBookings.forEach(booking => {
            for(let i = 0; i < spots.length; i++) {
                if(booking['spotId'] === spots[i].id) {
                    booking['Spot'] = spots[i]
                }
            }
        });
        //prep a response object the add all of the booking info to it
        //as an array at the key of 'Bookings'
        let response = {}
        response['Bookings'] = userBookings
        res.status(200)
        res.json(response)
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
//edit a booking
router.put('/:bookingId',
    requireAuth,
    validateBooking,
    async (req, res) => {
        //grab the user info from req
        const { user } = req;
        //grab the booking from the id and check if it is a valid 
        //booking, if not, send an error
        const booking = await Booking.findByPk(req.params.bookingId)
        if(!booking){
            res.status(404)
            res.json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            })
        }
        //if the booking does not belong to the active user, send error
        if(booking.userId !== user.id){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //grab the booking info from req.
        const {
            startDate,
            endDate
        } = req.body
        //check the bookings end date to see if it's already passed.
        //send an error it if has. 
        const rawBooking = await Booking.findByPk(req.params.bookingId, {raw: true})
        if(Date.parse(rawBooking.endDate) < Date.parse(new Date())){
            res.status(403),
            res.json({
                "message": "Past bookings can't be modified",
                "statusCode": 403
              })
        }
        //get each of the bookings
        const existingSpotBookings = await Booking.findAll({
            where: {
                spotId: booking['spotId']
            },
            raw: true
        })
        //compare all the existing books at that spot to see if the start
        //and end time conflict with the booking to update.
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
        //if there is no booking conflict, change the booking and save it
        if(!bookingConflict){
            booking.set({
                startDate: startDate,
                endDate: endDate
            })
            await booking.save()
        }

        res.status(200)
        res.json(booking)
    }
)
//delete a booking by id
router.delete('/:bookingId',
    requireAuth,
    async (req, res) => {
        //get the user info from req
        const { user } = req;
        //find the booking to delete, check if its a valid it,
        //if not, send error
        const booking = await Booking.findByPk(req.params.bookingId)
        if(!booking) {
            res.status(404)
            res.json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            })
        }
        //if the user is not the owner of the booking, send error
        if(booking.userId !== user.id) {
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //check the booking startDate to see if it's passed, error if so
        if(Date.parse(booking['startDate']) < Date.parse(new Date())){
            res.status(403)
            res.json({
                "message": "Bookings that have been started can't be deleted",
                "statusCode": 403
              })
        }
        //if the user is the owner of the booking and the startDate has not
        //passed, delete the booking. 
        if(booking.userId === user.id) {
            await booking.destroy()
            res.status(200)
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }
    } 
)

module.exports = router;
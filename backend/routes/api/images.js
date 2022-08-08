const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');
const { route } = require('./spots');

//delete an image by id
router.delete('/:imageId',
    requireAuth,
    async (req, res) => {
        //get the user info from req
        const { user } = req
        //get the image by id, check if the id is invalid
        //send error if invalid
        const image = await Image.findByPk(req.params.imageId)
        if(!image){
            res.status(404)
            res.json({
                "message": "Image couldn't be found",
                "statusCode": 404
              })
        }
        //check to see if the image belongs to the active user,
        //if not, throw error
        if(image.userId !== user.id){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }
        //if the active user owns the image, delete the image
        if(image.userId === user.id) {
            await image.destroy()
            res.status(200)
            return res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }
    }
)

module.exports = router;
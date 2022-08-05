const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const {Booking, Image, Review, Spot, User, sequelize} = require('../../db/models');
const { response } = require('express');
const { route } = require('./spots');

router.delete('/:imageId',
    requireAuth,
    async (req, res) => {

        const { user } = req

        const image = await Image.findByPk(req.params.imageId)

        if(!image){
            res.status(404)
            res.json({
                "message": "Image couldn't be found",
                "statusCode": 404
              })
        }

        if(image.userId !== user.id){
            res.status(403)
            res.json({
                "message": "Forbidden",
                "statusCode": 403
              })
        }

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
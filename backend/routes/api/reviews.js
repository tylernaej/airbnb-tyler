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
        let responseArray = []
        
        const reviews = await Review.findAll({
            where: {
                userId: user.dataValues.id
            },
            include: [
                {model: User, attributes: ['id','firstName','lastName']},
                {model: Spot, attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price']},
                {model: Image, attributes: ['id','url']}
            ],
            group: ["Spot.id"],
            raw: true
        })
        
        res.send(reviews)
    }
    )


module.exports = router;
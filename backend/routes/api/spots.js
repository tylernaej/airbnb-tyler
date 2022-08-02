const express = require('express');
const router = express.Router();

const {Booking, Image, Review, Spot, User} = require('../../db/models');

router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {

    })
    res.json(spot)
})





module.exports = router;
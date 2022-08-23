import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink, useParams } from 'react-router-dom';
import './SingleSpotFullDetails.css'


function SingleSpotFullDetails () {
    const activeSpot = useSelector(state => state.spots.activeSpot)
    const spotId = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(spotsActions.getSpotById(spotId))
    }, [dispatch])

    return (
        <>
            <div>
                Information about {`${activeSpot.name}`}
            </div>
            <div className="spot-details">
                {activeSpot.description}
                {activeSpot.price}
                {activeSpot.numReviews}
                {activeSpot.avgRating}
                {activeSpot.address}
                {activeSpot.city}
                {activeSpot.state}
                {activeSpot.country}
                {activeSpot.lat}
                {activeSpot.lng}
            </div>
        </>
    )
} 

export default SingleSpotFullDetails
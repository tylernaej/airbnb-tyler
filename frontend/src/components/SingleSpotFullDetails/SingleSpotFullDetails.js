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

    let imagesArray = []
    if(activeSpot.Images.length > 0) {
        activeSpot.Images.forEach(image => {
            imagesArray.push(image.url)
        })
    }

    if(!activeSpot){
        return null
    }

    return (
        <div className="spot-detail-wrapper">  
            <div className="title-info">
                <h1>
                    {`${activeSpot.name}`}
                </h1>
                <div className="location-info">
                    <div>
                        {`${activeSpot.address},
                        ${activeSpot.city}, 
                        ${activeSpot.state}, 
                        ${activeSpot.country}`}
                    </div>
                </div>
                <div className="ratings-reviews-info">
                    <div className="ratings-info">
                        <i class="fa-solid fa-star"></i>
                        {`${activeSpot.avgRating}`}
                    </div>
                    <i class="fa-solid fa-grip-lines-vertical"></i>
                    <div className="reviews-info">
                        {`${activeSpot.numReviews} Reviews`}
                    </div>
                </div>
            </div>
            <div className="image-info">
                <ul className="image-catalog">
                    {imagesArray.map((image, index) => 
                        <div key={index}>
                            <img 
                                src={image}
                                alt={null}
                            />
                        </div>
                    )}
                </ul>
                <div className="link-to-images">
                    Link to all images?
                </div>
            </div>
            <div className="details-wrapper">
                <div className="basic-owner-info">
                    <h2 className="owner-info">
                        {`Hosted by ${activeSpot.Owner.firstName} ${activeSpot.Owner.lastName} `}
                    </h2>
                    <div className="description-info">
                        Here is a description of the spot:
                        <p>
                            {activeSpot.description}
                        </p>
                    </div>
                </div>
                <div className="booking-price-info">
                    <div>
                        Booking info will go here
                    </div>
                    <div>
                        {`Price - ${activeSpot.price} per night`}
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default SingleSpotFullDetails
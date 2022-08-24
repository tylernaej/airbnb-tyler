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
                {imagesArray.length <= 3 &&
                <div className="image-grid-wrapper">
                    <div className="image-grid-less">
                        <div className="main-image">
                            <img 
                                src={imagesArray.splice(0,1)}
                            />
                        </div>
                        <div className="first-column-top">
                            <img 
                                src={imagesArray.splice(0,1)}
                            />
                        </div>
                        <div className="first-column-bottom">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
                            />
                        </div>
                    </div>
                </div>
                }
                {(imagesArray.length > 3) &&
                <div className="image-grid-wrapper">
                    <div className="image-grid">
                        <div className="main-image">
                            <img 
                                src={imagesArray.splice(0,1)}
                            />
                        </div>
                        <div className="first-column-top">
                            <img 
                                src={imagesArray.splice(0,1)}
                                
                            />
                        </div>
                        <div className="first-column-bottom">
                            <img 
                                src={imagesArray.splice(0,1)}
                            />
                        </div>
                        <div className="optional-column-top">
                            <img 
                                src={imagesArray.splice(0,1)}
                            />
                        </div>
                        <div className="optional-column-bottom">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
                            />
                        </div>
                    </div>
                </div>
                }
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
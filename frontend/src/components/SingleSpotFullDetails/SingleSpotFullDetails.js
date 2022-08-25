import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink, useParams } from 'react-router-dom';
import './SingleSpotFullDetails.css'
import UpdateSpotFormModal from "../UpdateSpotModal";
import DeleteSpotSubmission from "../DeleteSpotButton/DeleteSpotSubmission";


function SingleSpotFullDetails () {
    const sessionUser = useSelector((state) => state.session.user);
    const activeSpot = useSelector(state => state.spots.activeSpot)
    const spotId = useParams()
    const dispatch = useDispatch()

    // useEffect(() => {
    //     console.log('single spot')
    //     dispatch(spotsActions.getSpotById(spotId.id))
    // }, [dispatch])

    let imagesArray = []
    if(activeSpot.Images.length > 0) {
        activeSpot.Images.forEach(image => {
            imagesArray.push(image.url)
        })
    }

    if(!activeSpot){
        console.log('Loading')
        return (
            <div>Loading</div>
        )
    }


    console.log('Active Spot', typeof activeSpot)

    return (
        <div className="spot-detail-wrapper">  
            <div className="title-info">
                <div className="non-owner-details">
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
                            {/* <i className="fa-solid fa-star"></i> */}
                            {`${activeSpot.avgRating}`}
                        </div>
                        {/* <i className="fa-solid fa-grip-lines-vertical"></i> */}
                        <div className="reviews-info">
                            <NavLink to={`/reviews/${activeSpot.id}`}>
                                {`${activeSpot.numReviews} Reviews`}
                            </NavLink>
                        </div>
                    </div>
                </div>
                {sessionUser && (activeSpot.ownerId === sessionUser.id) && 
                <div className="owner-functions">
                    <div>
                        <UpdateSpotFormModal />
                    </div>
                    <div>
                        <DeleteSpotSubmission />
                    </div>
                </div>
                }
            </div>
            <div className="image-info">
                {imagesArray.length <= 3 &&
                <div className="image-grid-wrapper">
                    <div className="image-grid-less">
                        <div className="main-image">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
                            />
                        </div>
                        <div className="first-column-top">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
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
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
                            />
                        </div>
                        <div className="first-column-top">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
                            />
                        </div>
                        <div className="first-column-bottom">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
                            />
                        </div>
                        <div className="optional-column-top">
                            <img 
                                src={imagesArray.splice(0,1)}
                                onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}}
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
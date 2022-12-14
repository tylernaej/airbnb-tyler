import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink, useHistory } from 'react-router-dom';
import './IndividualSpotDisplay.css'

function IndividualSpotDisplay ({spot}) {
    const dispatch = useDispatch()
    const history = useHistory()

    const handleClick = (e) => {
        e.preventDefault();
        dispatch(spotsActions.getSpotById(spot.id));
        // history.push(`/spots/${spot.id}`)
    }

    if(!spot){
        return null
    }

    return (
        <div className="individual-spot-wrapper" onClick={handleClick}>
            <NavLink to={`/spots/${spot.id}`} className="individual-spot-wrapper">
                <div className="preview-image-wrapper">
                    {!spot.previewImage && 
                        <div>
                        <img
                            className="preview-image" 
                            src='https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg'
                            alt={null} 
                        />
                        </div> 
                    }
                    {spot.previewImage &&
                    <div>
                        <img
                            className="preview-image" 
                            src={spot.previewImage}
                            onError={(e)=>{e.target.onerror = null; e.target.src="https://venturebeat.com/wp-content/uploads/2014/07/airbnb-logo-red.jpg?fit=750%2C422&strip=all"}} 
                        />
                    </div> 
                    }
                </div>
                <div className="spot-details">
                    <div className="detail-header">
                        <div>{`${spot.city}, ${spot.state}`}</div>
                        {spot.avgRating &&                    
                        <div className="star-rating">
                            <i className="fa-solid fa-star"></i>
                            <div className="rating-number">{`${spot.avgRating}`}</div>
                        </div>
                        }
                        {!spot.avgRating && 
                        <div>New!</div>
                        }
                    </div>
                    <div className="price-details">{`$${spot.price} night`}</div>
                </div>
            </NavLink>
        </div>
    )
}

export default IndividualSpotDisplay
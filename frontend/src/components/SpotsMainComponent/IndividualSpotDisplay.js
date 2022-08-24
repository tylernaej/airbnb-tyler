import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink } from 'react-router-dom';
import './IndividualSpotDisplay.css'

function IndividualSpotDisplay ({spot}) {
    const dispatch = useDispatch()

    const handleClick = async (e) => {
        e.preventDefault();
        const selectedSpot = await dispatch(spotsActions.getSpotById(spot.id));
    }

    return (
        <div className="individual-spot-wrapper" onClick={handleClick}>
            <NavLink to={`/spots/${spot.id}`} >
                <div>
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
                            alt={null} 
                        />
                    </div> 
                    }
                </div>
                <div className="spot-details">
                    <div>
                        <div>{`${spot.city}, ${spot.state}`}</div>
                        <div>Stars: {`${spot.avgRating}`}</div>
                    </div>
                    <div>Days that are available?</div>
                    <div>{`$${spot.price} night`}</div>
                </div>
            </NavLink>
        </div>
    )
}

export default IndividualSpotDisplay
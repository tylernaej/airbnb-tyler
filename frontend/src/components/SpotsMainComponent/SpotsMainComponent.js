import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink } from 'react-router-dom';
import IndividualSpotDisplay from "./IndividualSpotDisplay";
import './SpotsMainComponent.css'

function SpotsMainComponent () {
    const dispatch = useDispatch();
    const currentAllSpots = useSelector(state => state.spots);

    useEffect(() => {
        dispatch(spotsActions.getAllSpots());
    }, [dispatch])

    if(!currentAllSpots.spots){
        return (
            <div>Loading</div>
        )
    } else {
        return (
            <div className="content-wrapper">
                <div className="list-of-spots">
                    {Object.values(currentAllSpots.spots).map(({id, ownerId, address, city, state, country, description, lat, lng, name, price, avgRating, previewImage}) => {
                        const spot = {id, ownerId, address, city, state, country, description, lat, lng, name, price, avgRating, previewImage}
                        return (
                            <div key={id} className='single-spot-wrapper'>
                                <IndividualSpotDisplay spot={spot}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default SpotsMainComponent
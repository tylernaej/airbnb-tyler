import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink } from 'react-router-dom';
import SpotsDisplayList from "./SpotsDisplayList";
import IndividualSpotDisplay from "./IndividualSpotDisplay";
import './SpotsMainComponent.css'

function SpotsMainComponent () {
    const dispatch = useDispatch();
    const currentAllSpots = useSelector(state => state.spots);

    useEffect(() => {
        dispatch(spotsActions.getAllSpots());
    }, [dispatch])

    console.log(currentAllSpots)

    if(!currentAllSpots.spots){
        console.log('entered loading')
        return (
            <div>Loading</div>
        )
    } else {
        console.log('entered loader')
        return (
            <div className="content-wrapper">
                Content To Go Here
                <div className="list-of-spots">
                    {Object.values(currentAllSpots.spots).map(({id, ownerId, address, city, state, country, description, lat, lng, name, price, avgRating, previewImage}) => {
                        const spot = {id, ownerId, address, city, state, country, description, lat, lng, name, price, avgRating, previewImage}
                        return (
                            <div key={id}>
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
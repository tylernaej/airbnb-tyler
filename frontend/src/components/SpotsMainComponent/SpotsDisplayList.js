import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink } from 'react-router-dom';
import IndividualSpotDisplay from "./IndividualSpotDisplay";


function SpotsDisplayList () {
    const spots = useSelector(state => state.spots)

    return (
        <div>
            <h1>Spots List</h1>
            <ol>
                {Object.values(spots).map(({id, ownerId, address, city, state, country, description, lat, lng, name, price}) => (
                    <li key={id}>
                        <IndividualSpotDisplay />
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default SpotsDisplayList
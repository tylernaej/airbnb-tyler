import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as spotsActions from '../../store/spots';
import { NavLink } from 'react-router-dom';
import SpotsDisplayList from "./SpotsDisplayList";
import IndividualSpotDisplay from "./IndividualSpotDisplay";

function SpotByIdComponent (id) {
    const dispatch = useDispatch
    const currentSpot = useSelector(state => state.spot)

    useEffect(() => {
        dispatch(spotsActions.getSpotById(id));
    }, [dispatch])

    return (
        <div>
            Specific Spot Information Here
        </div>
    )
}
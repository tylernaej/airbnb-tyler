import { NavLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews'

function ReviewsById () {
    const spot = useParams()
    const dispatch = useDispatch()
    const activeReviews = useSelector(state => state.reviews)

    useEffect(() => {
        dispatch(reviewsActions.getReviewsBySpotId(spot.id))
    }, [dispatch])

    if(!activeReviews){
        return (
            <div>
                 {`Review Information Will Go Here for spot with the id of ${spot.id}`}
            </div>
        )
    }

    return (
        <div>
            {`Review Information Will Go Here for spot with the id of ${spot.id}`} 
        </div>
    )
}

export default ReviewsById
import { NavLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews'
import './ReviewsList.css'

function ReviewsList () {
    const dispatch = useDispatch()
    const activeSpot = useSelector(state => state.spots.activeSpot)
    const activeReviews = useSelector(state => state.reviews)

    useEffect(() => {
        dispatch(reviewsActions.getReviewsBySpotId(activeSpot.id))
    }, [dispatch])

    if(!activeReviews){
        return (
            <div>
                Loading
            </div>
        )
    }

    console.log(activeReviews)

    return (
        <div className=''>
            {`Reviews List Component Here for ${activeSpot.name}`}
            <div className='stars-numReviews-header'>
                <div>
                    Stars
                </div>
                <div>
                    Number of reviews
                </div>
                <div>
                    Optional Create/Edit If !Owner
                </div>
            </div>
            <div className='searchBar'>
                Potential for a search feature here
            </div>
                <div>
                    List of Reviews Here - will include reviewer and review
                    {/* {activeReviews.map((review) => {
                        return (
                            <>
                                <div>
                                    Name of Reviewer
                                </div>
                                <div>
                                    Review info
                                </div>
                            </>
                        )
                    })} */}
                </div>
        </div>
    )
}

export default ReviewsList;
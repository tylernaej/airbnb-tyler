import { NavLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews'
import './ReviewsList.css'

function ReviewsList () {
    const dispatch = useDispatch()
    const sessionUser = useSelector (state => state.session.user)
    const activeSpot = useSelector(state => state.spots.activeSpot)
    const activeReviews = useSelector(state => state.reviews)

    useEffect(() => {
        dispatch(reviewsActions.getReviewsBySpotId(activeSpot.id))
    }, [dispatch])

    if(!activeReviews.reviews || !sessionUser|| !activeSpot){
        return (
            <div>
                Loading
            </div>
        )
    }

    return (
        <div className=''>
            {`Reviews List Component Here for ${activeSpot.name}`}
            <div className='stars-numReviews-header'>
                <div>
                    <i className="fa-solid fa-star"></i>
                    {activeSpot.avgRating}
                </div>
                <div>
                    {`${activeSpot.numReviews} Reviews`}
                </div>
                {(activeSpot.ownerId !== sessionUser.id) &&
                    <div>Optional Create If !Owner</div>
                }
            </div>
            <div className='searchBar'>
                Potential for a search feature here
            </div>
                <div>
                    List of Reviews Here - will include reviewer and review
                    {Object.values(activeReviews.reviews).map((review, idx) => (
                        <div key={idx}>
                            <div>
                                {`${review.User.firstName} -`}
                            </div>
                            <div>
                                {`"${review.review}"`}
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default ReviewsList;
import { NavLink, useHistory, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews'
import './ReviewsList.css'
import DeleteReview from '../DeleteReviewButton/DeleteReviewButton';
import LoginFormModal from '../LoginFormModal';

function ReviewsList ({setShowModal, reviewsDisplay, setReviewsDisplay}) {
    const dispatch = useDispatch()
    const sessionUser = useSelector (state => state.session.user)
    const activeSpot = useSelector(state => state.spots.activeSpot)
    const activeReviews = useSelector(state => state.reviews)
    const [showCreateReview, setShowCreateReview] = useState(false)
    const [hideButton, setHideButton] = useState(false)
    const [review, setReview] = useState('')
    const [submitStars, setSubmitStars] = useState(0)
    const [errors, setErrors] = useState([]);
    const history = useHistory()

    // useEffect(() => {
    //     dispatch(reviewsActions.getReviewsBySpotId(activeSpot.id))
    // }, [dispatch])

    const doubleFunction = () => {
        setHideButton(current => !current);
        setShowCreateReview(current => !current)
    }

    const formSubmit = async (e) => {
        e.preventDefault();
        setErrors([])

        const stars = Number(submitStars)
        const formSubmission = {
            review,
            stars
        }

        const newReview = dispatch(reviewsActions.createNewReview(formSubmission, activeSpot.id))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
            alert('Successfully Added Review')
            setReviewsDisplay(current => current + 1)
            setShowModal(false)
    }

    if(!activeReviews.reviews || !activeSpot){
        return (
            <div>
                Loading
            </div>
        )
    }

    if (!sessionUser){
        return (
            <div>
                Please 
                <LoginFormModal />
                 to see reviews
            </div>
        )
    }

    return (
        <div className=''>
            {`Reviews List Component Here for ${activeSpot.name}`}
            <div>
                <div className='stars-numReviews-header'>
                    <div>
                        <i className="fa-solid fa-star"></i>
                        {activeSpot.avgRating}
                    </div>
                    <div>{reviewsDisplay} Reviews</div>
                </div>
            </div>
            <div className='create-review'>
                {(activeSpot.ownerId !== sessionUser.id) && !hideButton &&
                    <button onClick={() => doubleFunction() }>Make a Review</button>                    
                }
                {showCreateReview &&
                    <div className='review-create-menu'>
                        <div className='create-header'>Create a Review</div>
                        <form onSubmit={formSubmit}>
                            <div className='submission-fields'>
                                <label>
                                    Review
                                    <input
                                        placeholder='Review details'
                                        type="text"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        required                                
                                        />
                                </label>
                                <label>
                                    Stars
                                    <input
                                        placeholder='1 through 5'
                                        type="number"
                                        value={submitStars}
                                        onChange={(e) => setSubmitStars(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <div className='review-buttons'>
                                <button type="submit" className='submit-button'>Submit</button>
                                <button onClick={() => doubleFunction() } className='cancel-button'>Cancel</button>
                            </div>
                        </form>
                    </div> 
                }
            </div>
            <div className='searchBar'>
                Potential for a search feature here
            </div>
                <div>
                    List of Reviews Here - will include reviewer and review
                    {Object.values(activeReviews.reviews).map((review, idx) => (
                        <div key={idx} className='single-review'>
                            <div>
                                <div>
                                    {`${review.User.firstName} -`}
                                </div>
                                <div>
                                    {sessionUser.id === review.User.id &&
                                        <DeleteReview reviewId={review.id} setShowModal={setShowModal} setReviewsDisplay={setReviewsDisplay}/>
                                    }
                                </div>
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
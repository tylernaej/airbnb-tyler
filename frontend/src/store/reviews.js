//imports
import { csrfFetch } from './csrf';

//Types
const SET_REVIEWS = 'reviews/getReviewsOfSpot'
const ADD_REVIEW = 'reviews/addReview'
const NULL_REVIEWS = 'reviews/nullAllReviews'


//Action Creators
const setReviews = (reviews) => {
    return {
        type: SET_REVIEWS,
        reviews
    }
}

const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

export const nullReviews = () => {
    return{
        type: NULL_REVIEWS
    }
}


//Thunk Action Creators
export const getReviewsBySpotId = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`);
    if (response.ok) {
        const reviews = await response.json()
        dispatch(setReviews(reviews.Reviews))
        return reviews
    }
}

export const createNewReview = (formSubmission, id) => async (dispatch) => {
    const {review, stars} = formSubmission
    console.log('In thunk -', review, typeof stars, stars, typeof id, id)
    const response = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
            review,
            stars
        })
    })
    const newReview = await response.json()
    dispatch(addReview(newReview))
    return newReview
}

//Reducers
const initialState = { reviews: null}

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_REVIEWS:
            let newReviews = {}
            action.reviews.forEach((review) =>newReviews[review.id] = review);
            newState = {...state, reviews: {...newReviews}}
            return newState
        case ADD_REVIEW:
            const newReview = action.review
            newState = {...state, reviews: {...state.reviews}}
            newState.reviews[`${newReview.id}`] = newReview
            return newState
        case NULL_REVIEWS:
            newState = {...state, reviews: null}
            return newState
        default:
            return state
    }
}

export default reviewsReducer
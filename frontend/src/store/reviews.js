//imports
import { csrfFetch } from './csrf';

//Types
const SET_REVIEWS = 'reviews/getReviewsOfSpot'


//Action Creators
const setReviews = (reviews) => {
    return {
        type: SET_REVIEWS,
        reviews
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

//Reducers
const initialState = { reviews: null}

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_REVIEWS:
            console.log(action.reviews)
            let newReviews = {}
            action.reviews.forEach((review) =>newReviews[review.id] = review);
            newState = {...state, reviews: {...newReviews}}
            return newState
        default:
            return state
    }
}

export default reviewsReducer
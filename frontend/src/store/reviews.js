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
    const response = await csrfFetch(`/api/${id}/reviews`);
    if (response.ok) {
        const reviews = await response.json()
        console.log('Reviews', reviews)
        dispatch(setReviews(reviews))
        return reviews
    }
}

//Reducers
const initialState = { reviews: null}

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_REVIEWS:
            let newReviews = {}
            return null
        default:
            return state
    }
}
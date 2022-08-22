//Imports
import { csrfFetch } from './csrf';


//Types
const SET_SPOTS = 'spots/getAllSpots'


//Action Creators
const setSpots = (spots) => {
    return {
        type: SET_SPOTS,
        spots
    }
}


//Thunk Action Creators
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    if(response.ok) {
        const spots = await response.json()
        dispatch(setSpots(spots.spots))
        return spots
    }
}


//Reducers

const initialState = { spots: null };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SPOTS:
            let newState;
            let newSpots = {} 
            action.spots.forEach((spot) => newSpots[spot.id] = spot);
            return {...state, spots: {...newSpots}}
            // newState = Object.assign({}, state);
            // newState.spots = action.spotsList.spots
            // console.log(newSpots)
            // return newState;
        default:
            return state;
    }
}

export default spotsReducer;
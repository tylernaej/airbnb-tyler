//Imports
import { csrfFetch } from './csrf';


//Types
const SET_SPOTS = 'spots/getAllSpots'
const SET_SPOT = 'spots/getSpotById'
const ADD_SPOT = 'spots/addSpotToSpots'


//Action Creators
const setSpots = (spots) => {
    return {
        type: SET_SPOTS,
        spots
    }
}

const setSpot = (spot) => {
    return {
        type: SET_SPOT,
        spot
    }
}

const addSpotToSpots = (spot) =>{
    return {
        type: ADD_SPOT,
        spot
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

export const getSpotById = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`);
    if(response.ok) {
        const spot = await response.json()
        dispatch(setSpot(spot))
        return spot
    }
}

export const createNewSpot = (formSubmission) => async (dispatch) => {
    const {address, city, state, country, lat, lng, name, description, price, user} = formSubmission
    const response = await csrfFetch("api/spots", {
        method: "POST",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            user
        })
    })
    const spot = await response.json()
    console.log(spot)
    dispatch(addSpotToSpots(spot))
    return spot
}


//Reducers

const initialState = { spots: null, activeSpot: null };

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_SPOTS:
            let newSpots = {} 
            action.spots.forEach((spot) => newSpots[spot.id] = spot);
            newState = {...state, spots: {...newSpots}}
            return newState
        case SET_SPOT:
            newState = {...state, activeSpot: action.spot}
            return newState
        case ADD_SPOT:
            const newSpot = action.spot
            newState = {...state, spots: {...state.spots, newSpot}}
            return newState
        default:
            return state;
    }
};

export default spotsReducer;
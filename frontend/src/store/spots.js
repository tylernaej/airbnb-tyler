//Imports
import { csrfFetch } from './csrf';


//Types
const SET_SPOTS = 'spots/getAllSpots'
const SET_SPOT = 'spots/getSpotById'
const ADD_SPOT = 'spots/addSpotToSpots'
const UPDATE_SPOT = 'spots/updateSpot'
const NULL_ACTIVE_SPOT = 'spots/nullActiveSpot'
const SET_PREVIEW_IMAGE = 'spots/setSpotPreviewImage'


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

const addSpotToSpots = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot
    }
}

export const nullSpot = () => {
    return {
        type: NULL_ACTIVE_SPOT
    }
}

const setPreviewImage = (image) => {
    return {
        type: SET_PREVIEW_IMAGE,
        image
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
    }
}

export const createNewSpot = (formSubmission) => async (dispatch) => {
    const {address, city, state, country, lat, lng, name, description, price, previewImage} = formSubmission
    const response = await csrfFetch("/api/spots", {
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
        })
    })
    const spot = await response.json()

    let url = previewImage

    const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url,
            previewImage: true
        })
    })
    const image = await imageResponse.json()

    spot.previewImage = image.url

    dispatch(addSpotToSpots(spot))
    return spot
}

export const deleteSpot = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
    });
    const message = await response.json()
    return message
}

export const updateExistingSpot = (id, formSubmission) => async (dispatch) => {
    const {address, city, state, country, lat, lng, name, description, price} = formSubmission
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
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
        })
    })
    const spot = await response.json()
    dispatch(updateSpot(spot))
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
            newState = {...state, spots: {...state.spots}}
            newState.spots[Number((action.spot.id))] = newSpot
            return newState
        case UPDATE_SPOT:
            let spotsToUpdate = {...state.spots}
            spotsToUpdate[Number((action.spot.id))] = action.spot
            newState = {...state, spots: {...spotsToUpdate}}
            return newState
        case NULL_ACTIVE_SPOT:
            newState = {...state}
            newState.activeSpot = null
            return newState
        case SET_PREVIEW_IMAGE:
            newState = {...state}
            newState.spots[`${action.image.imageableId}`].previewImage = action.image.url
        default:
            return state;
    }
};

export default spotsReducer;
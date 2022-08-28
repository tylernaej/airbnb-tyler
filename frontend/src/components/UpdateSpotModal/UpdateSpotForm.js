import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as spotsActions from "../../store/spots";
import './UpdateSpotForm.css'

function UpdateSpotForm({showModal, setShowModal}) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const activeSpot = useSelector(state => state.spots.activeSpot)
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")  
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [errors, setErrors] = useState([]);
    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        let errorsArray = []
        const formSubmission = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        }

        if(!Number(lat)) errorsArray.push('Lat must be listed as numbers')
        if(!Number(lng)) errorsArray.push('Lng must be listed as numbers')
        if(parseFloat(lat) < -90 || parseFloat(lat) > 90) errorsArray.push('Lat must be between -90 and 90')
        if(parseFloat(lng) < -180 || parseFloat(lng) > 180) errorsArray.push('Lng must be between -180 and 180')
        if(!Number(price)) errorsArray.push('Price must be listed as a number')
        setErrors(errorsArray)

        if(errorsArray.length === 0){
            dispatch(spotsActions.updateExistingSpot(activeSpot.id, formSubmission))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                })
                alert('Successfully Updated Spot')
                setShowModal(false)
                history.push(`/`)
        }
    }

    return (
        <form className="update-form" onSubmit={handleSubmit}>
            <h3 className="signup-bar">Fill out the fields below to update this Spot</h3>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className="update-submission-fields">
                <input
                    placeholder={`Address - ${activeSpot.address}`}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <input
                    placeholder={`City - ${activeSpot.city}`}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <input
                    placeholder={`State - ${activeSpot.state}`}
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
                <input
                    placeholder={`Country - ${activeSpot.country}`}
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
                <input
                    placeholder={`Lat - ${activeSpot.lat}`}
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
                <input
                    placeholder={`Lng - ${activeSpot.lng}`}
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                />
                <input
                    placeholder={`Name - ${activeSpot.name}`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    placeholder={`Description - ${activeSpot.description}`}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    placeholder={`Price - ${activeSpot.price}`}
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="submit-button-wrapper">
                <button type="submit" className="submit-button">Update Spot</button>
            </div>
        </form>
    );
}

export default UpdateSpotForm;
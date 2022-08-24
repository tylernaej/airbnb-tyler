import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as spotsActions from "../../store/spots";

function AddSpotForm() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")  
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [errors, setErrors] = useState([]);
    const history = useHistory()


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
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
            user: sessionUser
        }
        if(sessionUser){
            return dispatch(spotsActions.createNewSpot(formSubmission))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="signup-bar">Fill out the fields below to start hosting</h3>
            <h1 className="welcome-bar">Become a Host</h1>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className="submission-fields">
                <input
                    placeholder="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <input
                    placeholder="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <input
                    placeholder="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
                <input
                    placeholder="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
                <input
                    placeholder="lat"
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
                <input
                    placeholder="lng"
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                />
                <input
                    placeholder="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    placeholder="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    placeholder="price"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="submit-button-wrapper">
                <button type="submit" className="submit-button">Start Hosting</button>
            </div>
        </form>
    );
}

export default AddSpotForm;
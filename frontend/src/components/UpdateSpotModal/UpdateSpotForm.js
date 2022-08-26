import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as spotsActions from "../../store/spots";

function UpdateSpotForm({showModal, setShowModal}) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const activeSpot = useSelector(state => state.spots.activeSpot)
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

    const handleSubmit = async (e) => {
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
        }

        dispatch(spotsActions.updateExistingSpot(activeSpot.id, formSubmission))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
            alert('Successfully Updated Spot')
            setShowModal(false)
            history.push(`/`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="signup-bar">Fill out the fields below to update this Spot</h3>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className="submission-fields">
                <input
                    placeholder={`${activeSpot.address}`}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.city}`}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.state}`}
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.country}`}
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.lat}`}
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.lng}`}
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.name}`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.description}`}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    placeholder={`${activeSpot.price}`}
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
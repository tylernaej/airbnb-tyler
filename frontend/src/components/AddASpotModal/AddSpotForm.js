import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as spotsActions from "../../store/spots";
import './AddSpotForm.css'

function AddSpotForm({showModal, setShowModal}) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")  
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [previewImage, setPreviewImage] = useState("")
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
            previewImage
        }

        if(!Number(lat)) errorsArray.push('Lat must be listed a number between -90 and 90')
        if(!Number(lng)) errorsArray.push('Lng must be listed as a number between -180 and 180')
        if(parseFloat(lat) < -90 || parseFloat(lat) > 90) errorsArray.push('Lat must be between -90 and 90')
        if(parseFloat(lng) < -180 || parseFloat(lng) > 180) errorsArray.push('Lng must be between -180 and 180')
        if(!Number(price)) errorsArray.push('Price must be listed as a number')

        if(!(/.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(previewImage.split('?')[0]))){
            errorsArray.push("Please submit a valid preview image")
          }

        setErrors(errorsArray)

        if(errorsArray.length === 0){
            const newSpot = await dispatch(spotsActions.createNewSpot(formSubmission))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                })
    
            setShowModal(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} >
            <div className='add-spot-form'>
                <div className="header">
                    <h3 className="signup-bar">Fill out the fields below to start hosting</h3>
                    <h1 className="welcome-bar">Become a Host</h1>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                </div>
                <div className="host-submission-fields">
                    <label>
                        <input
                            placeholder="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="state"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="country"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="lat"
                            type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="lng"
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="price"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder="preview image"
                            type="text"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="submit-button-wrapper">
                    <button type="submit" className="submit-button">Start Hosting</button>
                </div>

            </div>
        </form>
    );
}

export default AddSpotForm;
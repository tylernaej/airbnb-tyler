import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";

function AddSpotForm() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [firstName, setFirstName] = useState("")  
    const [errors, setErrors] = useState([]);

    return (
        <form >
        <h2 className="signup-bar">Become a Host</h2>
        <h1 className="welcome-bar">Welcome to Airbnb</h1>
        <ul>
        </ul>
        <div className="submission-fields">
            <label>
            {/* First Name */}
            <input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            </label>
        </div>
        <div className="submit-button-wrapper">
            <button type="submit" className="submit-button">Start Hosting</button>
        </div>
        </form>
    );
}

export default AddSpotForm;
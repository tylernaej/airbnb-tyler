import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from "react";
import { NavLink, useHistory, useParams } from 'react-router-dom';
import * as reviewsActions from '../../store/reviews'
import './DeleteReviewButton.css'

function DeleteReview ({reviewId, setShowModal, setReviewsDisplay}) {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);

    const handleClick = (e) => {
        e.preventDefault()

        const message = dispatch(reviewsActions.deleteReview(reviewId))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        })

        alert('Review Successfully Deleted')
        setReviewsDisplay(current => current - 1)
        setShowModal(false)
    }

    return (
        <div>
            <button className='delete-button' onClick={handleClick}>Delete</button>
        </div>
    )
}

export default DeleteReview
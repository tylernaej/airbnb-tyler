import React, { useState, useEffect } from 'react';
import { Modal } from '../../context/Modal';
import ReviewsList from './ReviewsList';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews'



function ReviewModal() {
  const activeSpot = useSelector(state => state.spots.activeSpot)
  const activeReviews = useSelector(state => state.reviews)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [reviewsDisplay, setReviewsDisplay] = useState((activeSpot.numReviews))

  useEffect(() => {
    dispatch(reviewsActions.getReviewsBySpotId(activeSpot.id))
    // setReviewsDisplay(activeSpot.numReviews)
  }, [dispatch, reviewsDisplay])

  if(!activeReviews || !activeSpot || Number(window.location.pathname.split('/')[2]) !== activeSpot.id){
    return (
        <div>Loading</div>
    )
}

  return (
    <>
      <div onClick={() => setShowModal(true)}>{reviewsDisplay} Reviews</div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ReviewsList setShowModal={setShowModal} setReviewsDisplay={setReviewsDisplay}/>
        </Modal>
      )}
    </>
  );
}

export default ReviewModal;
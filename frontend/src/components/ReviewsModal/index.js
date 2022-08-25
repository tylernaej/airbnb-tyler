import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import ReviewsList from './ReviewsList';


function ReviewModal({numReviews}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div onClick={() => setShowModal(true)}>{numReviews} Reviews</div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ReviewsList setShowModal={setShowModal}/>
        </Modal>
      )}
    </>
  );
}

export default ReviewModal;
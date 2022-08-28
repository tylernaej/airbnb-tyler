import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import UpdateSpotForm from './UpdateSpotForm';
import './index.css'

function UpdateSpotFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className='update-spot-button' onClick={() => setShowModal(true)}>Update this Spot</div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UpdateSpotForm setShowModal={setShowModal}/>
        </Modal>
      )}
    </>
  );
}

export default UpdateSpotFormModal;
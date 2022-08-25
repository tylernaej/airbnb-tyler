import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import UpdateSpotForm from './UpdateSpotForm';

function UpdateSpotFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div onClick={() => setShowModal(true)}>Update this Spot</div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UpdateSpotForm/>
        </Modal>
      )}
    </>
  );
}

export default UpdateSpotFormModal;
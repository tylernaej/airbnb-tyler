import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignUpForm from './SignUpForm'

function SignUpFormModal() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation()
    setShowModal(true)
  }


  return (
    <>
      <button className='button' onClick={handleClick}>Sign Up</button>
      {showModal && (
        <Modal style={'border-radius: 10px'} onClose={() => setShowModal(false)}>
          <SignUpForm />
        </Modal >
      )}
    </>
  );
}

export default SignUpFormModal;
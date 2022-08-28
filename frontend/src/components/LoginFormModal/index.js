import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';
import './index.css'


function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation()
    setShowModal(true)
  }

  return (
    <>
      <button className='button' onClick={handleClick}>Log In</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} >
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
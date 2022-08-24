import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal } from '../../context/Modal';
import AddSpotForm from './AddSpotForm'
import SignUpForm from '../SignUpFormModal/SignUpForm';

function AddSpotFormModal() {
    const sessionUser = useSelector((state) => state.session.user);
    
    const [showModal, setShowModal] = useState(false);

    return (
        <div className='become-host-wrapper'>
            <div className='become-host-button' onClick={() => setShowModal(true)}>Become A Host</div>
            {showModal && sessionUser && (
            <Modal onClose={() => setShowModal(false)}>
                <AddSpotForm />
            </Modal>
            )}
            {showModal && !sessionUser && (
            <Modal onClose={() => setShowModal(false)}>
                <SignUpForm />
            </Modal>
            )}
        </div>
    );
}

export default AddSpotFormModal;
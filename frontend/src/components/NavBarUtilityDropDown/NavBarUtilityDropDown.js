import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import './NavBarUtilityDropDown.css'
import LoginFormModal from '../LoginFormModal';
import { NavLink } from 'react-router-dom';
import SignUpFormModal from "../SignUpFormModal";
import AddSpotFormModal from "../AddASpotModal";

function NavBarUtilityDropDown({user}) {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const loginDemoUser = () => {
    const credential = "demoUser"
    const password = "password"
    return dispatch(sessionActions.login({ credential, password }))
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  }

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="sessionLinks">
        {`Welcome, ${sessionUser.firstName}`}
        <div>{user.username}</div>
        <div>{user.email}</div>
        <div>
          <button className="logout-button" onClick={logout}>Log Out</button>      
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="sessionLinks">
        <button className="demo-user-button" onClick={loginDemoUser}>Demo User Login</button>
        <LoginFormModal />
        <SignUpFormModal />
      </div>
    );
  }
  
  const toggleMenu = (e) => {
    if(e.target.className === 'dropdownButton' ||
    e.target.className === 'fa-solid fa-bars' ||
    e.target.className === 'fa-solid fa-user'){
      setMenu(current => !current)
    }
  }

  return (
    <div className="upperRightNavContainer">
      <div className="host-wrapper">
        <div className="become-a-host">
            <AddSpotFormModal />
        </div>
      </div>
      <div className="utility-dropdown" onClick={(e) => toggleMenu(e)}>
        <div className="dropdownButton" >
            <i className="fa-solid fa-bars"></i>
            <i className="fa-solid fa-user"></i>
        </div>
        {menu && (
            <ul className="profile-dropdown">
              <div >
                  {sessionLinks}
              </div>
            </ul>
        )}
      </div>
    </div>
  );
}

export default NavBarUtilityDropDown
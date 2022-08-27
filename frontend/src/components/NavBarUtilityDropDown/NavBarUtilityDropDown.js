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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="sessionLinks">
        Logged In
        <div>{user.username}</div>
        <div>{user.email}</div>
        <div>
          <button onClick={logout}>Log Out</button>      
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="sessionLinks">
        Not logged in
        <button className="demo-user-button">Demo User Login</button>
        <LoginFormModal />
        <SignUpFormModal />
      </div>
    );
  }
  
  const toggleMenu = () => {
    setMenu(current => !current)
  }

  return (
    <div className="upperRightNavContainer">
      <div className="host-wrapper">
        <div className="become-a-host">
            <AddSpotFormModal />
        </div>
      </div>
      <div className="utility-dropdown" onClick={toggleMenu}>
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
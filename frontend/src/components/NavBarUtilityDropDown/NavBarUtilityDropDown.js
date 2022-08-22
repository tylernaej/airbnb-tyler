import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import './NavBarUtilityDropDown.css'
import LoginFormModal from '../LoginFormModal';
import { NavLink } from 'react-router-dom';
import SignUpFormModal from "../SignUpFormModal";

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
        <LoginFormModal />
        <SignUpFormModal />
      </div>
    );
  }
  
  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true);
  // };
  
  // useEffect(() => {
  //   if (!showMenu) return;

  //   const closeMenu = () => {
  //     setShowMenu(false);
  //   };

  //   document.addEventListener('click', closeMenu);
  
  //   return () => document.removeEventListener("click", closeMenu);
  // }, [showMenu]);
  const toggleMenu = () => {
    setMenu(current => !current)
  }

  return (
    <div className="upperRightNavContainer">
      <div className="host-wrapper">
        <div className="become-a-host">
            Become a Host
        </div>
      </div>
      <div className="utility-dropdown">
        <div className="dropdownButton" onClick={toggleMenu}>
            <i class="fa-solid fa-bars"></i>
            <i class="fa-solid fa-user"></i>
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
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import './NavBarUtilityDropDown.css'
import LoginFormModal from '../LoginFormModal';
import { NavLink } from 'react-router-dom';


function NavBarUtilityDropDown({user}) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        Logged In
        <div>{user.username}</div>
        <div>{user.email}</div>
        <div>
          <button onClick={logout}>Log Out</button>      
        </div>
      </>
    );
  } else {
    sessionLinks = (
      <>
        Not logged in
        <LoginFormModal />
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }
  
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);
  
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  return (
    <div className="upperRightNavContainer">
        <button>
            Become a Host
        </button>
        <button className="dropdownButton" onClick={openMenu}>
            <i class="fa-solid fa-bars"></i>
            <i class="fa-solid fa-user"></i>
        </button>
        {showMenu && (
            <ul className="profile-dropdown">
              <div className="sessionLinks">
                  {sessionLinks}
              </div>
            </ul>
        )}
    </div>
  );
}

export default NavBarUtilityDropDown
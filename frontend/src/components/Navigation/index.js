import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import NavBarUtilityDropDown from '../NavBarUtilityDropDown/NavBarUtilityDropDown'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        {/* <ProfileButton user={sessionUser} /> */}
        <NavBarUtilityDropDown user={sessionUser} />
      </>
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        {/* <NavLink to="/signup">Sign Up</NavLink> */}
        <NavBarUtilityDropDown />
      </>
    );
  }

  return (
    <div className='navbar'>
      <li className='navbarContents'>
        <NavLink exact to="/">
          <i class="fa-brands fa-airbnb"></i>
          airbnb
        </NavLink>
        {isLoaded && sessionLinks}
      </li>
    </div>
    
  );
}

export default Navigation;
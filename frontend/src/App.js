// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as spotsActions from './store/spots';
import Navigation from "./components/Navigation";
import SpotsMainComponent from "./components/SpotsMainComponent/SpotsMainComponent";
import './app.css'
import SingleSpotFullDetails from "./components/SingleSpotFullDetails/SingleSpotFullDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const activeSpot = useSelector(state => state.spots.activeSpot)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  
  useEffect(() => {
    if(!activeSpot){
      if(window.location.pathname.split('/')[1]==='spots' ||
      window.location.pathname.split('/')[1]==='reviews'){
        const path = window.location.pathname.split('/')[2]
        dispatch(spotsActions.getSpotById(Number(path)))
      }
    }
  }, [dispatch])

  return (
    <div className="page-body">
      <div className="nav-container">
        <Navigation isLoaded={isLoaded} />
      </div>
      <div className="body-container">
        <Switch>
          <Route path='/' exact={true}>
            <SpotsMainComponent />
          </Route>
          {activeSpot &&
            <Route path='/spots/:id'>
              <SingleSpotFullDetails />
            </Route>
          }
        </Switch>
      </div>
    </div>
  );
}

export default App;
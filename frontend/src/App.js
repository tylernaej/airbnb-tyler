// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsMainComponent from "./components/SpotsMainComponent/SpotsMainComponent";
import './app.css'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="page-body">
      <Navigation isLoaded={isLoaded} />
      {/* {isLoaded && (
        <Switch>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      )} */}
      <div>
        <Switch>
          <Route path='/' exact={true}>
            <SpotsMainComponent />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
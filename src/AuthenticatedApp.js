import React from 'react';
import AppBarComponent from './components/AppBar';
import Project from './components/Project';
import { Switch, Route, Redirect } from 'react-router-dom';
import firebase from 'firebase';

const AuthenticatedApp = () => {
  return (
    <div>
      <AppBarComponent />
      <Switch>
        <Route path="/new" exact component={Project} />
        <Route
          path="/"
          exact
          render={() => {
            // after the signout some render can occur before navigating
            // with currentUser null
            if (!firebase.auth().currentUser) return null;
            return <Redirect to="/new" />;
          }}
        />
      </Switch>
    </div>
  );
};

export default AuthenticatedApp;

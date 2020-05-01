import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import firebase from 'firebase';
import AppBar from './components/AppBar';
import Project from './components/Project';
import PageNotFound from './components/PageNotFound';
import Policies from './components/Policies';

const AuthenticatedApp = () => {
  return (
    <div>
      <AppBar />
      <Switch>
        <Route path="/new" exact component={Project} />
        <Route path="/player" exact component={Project} />
        <Route path="/policies/:policy" component={Policies} />
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
        <Route path="*" component={PageNotFound} />
      </Switch>
    </div>
  );
};

export default AuthenticatedApp;

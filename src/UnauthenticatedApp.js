import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseui from "firebaseui";
import firebase from "firebase";

const UnauthenticatedApp = ({ isLoading }) => {
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    },
    credentialHelper: firebaseui.auth.CredentialHelper.NONE
  };

  return (
    <div>
      <header className="App-header">
        <p>
          <span style={{ color: "lightgreen" }}>midi</span>
          <span style={{ color: "lightblue" }}>story</span>
        </p>
        {!isLoading && (
          <>
            <p>Register/Sign in:</p>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </>
        )}
      </header>
    </div>
  );
};

export default UnauthenticatedApp;

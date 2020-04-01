// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNyn2EoQmwdhQYnMy3lDO4tx00KCoa8t8",
  authDomain: "midi-story.firebaseapp.com",
  databaseURL: "https://midi-story.firebaseio.com",
  projectId: "midi-story",
  storageBucket: "midi-story.appspot.com",
  messagingSenderId: "501966433851",
  appId: "1:501966433851:web:dcae858e6cb5710815f61e",
  measurementId: "G-75GKWT8V4Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBTenkud8wd3uQhIh4C1hf-w0HYJzMCRI8",
  authDomain: "prjpwa-lasalle-firebase.firebaseapp.com",
  projectId: "prjpwa-lasalle-firebase",
  databaseURL: "https://prjpwa-lasalle-firebase-default-rtdb.firebaseio.com/",
  storageBucket: "prjpwa-lasalle-firebase.appspot.com",
  messagingSenderId: "159532967779",
  appId: "1:159532967779:web:cda1ef6e9cf1cf3e1e5556",
  measurementId: "G-HQKH6Y6KNT"
};

if (!firebase.apps.length) {
  console.log("inicilizando firebase...");
  firebase.initializeApp(firebaseConfig);
}
else
  console.log("algum problema :(");

export default firebase;
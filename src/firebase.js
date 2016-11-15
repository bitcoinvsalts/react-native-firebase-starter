// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyB3MkuNyc_1XW0p0BiFh5yBFawpuxZSz3g",
  authDomain: "rv-help.firebaseapp.com",
  databaseURL: "https://rv-help.firebaseio.com",
  storageBucket: "rv-help.appspot.com",
  messagingSenderId: "908329221036"  
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)

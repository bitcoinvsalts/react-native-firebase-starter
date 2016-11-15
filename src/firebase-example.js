// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCUeoGyNIbnQ5",
  authDomain: "someproject.firebaseapp.com",
  databaseURL: "https://someproject.firebaseio.com",
  storageBucket: "someproject.appspot.com",
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)

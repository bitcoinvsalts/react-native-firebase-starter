// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "xxxx",
  authDomain: "xxxx.firebaseapp.com",
  databaseURL: "https://xxxx.firebaseio.com",
  storageBucket: "xxxx.appspot.com",
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)

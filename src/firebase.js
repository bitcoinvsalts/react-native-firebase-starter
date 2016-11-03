// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCUeoGyNIbnQ5t3vHoIKCcdLBRKy3mSx6I",
  authDomain: "rnfirebasestarter.firebaseapp.com",
  databaseURL: "https://rnfirebasestarter.firebaseio.com",
  storageBucket: "rnfirebasestarter.appspot.com",
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)

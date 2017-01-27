// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAJfI1NNWzsAotQ8rRUp_PLa9T7k0ZSplY",
  authDomain: "myapp-1dbb8.firebaseapp.com",
  databaseURL: "https://myapp-1dbb8.firebaseio.com",
  storageBucket: "myapp-1dbb8.appspot.com",
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)

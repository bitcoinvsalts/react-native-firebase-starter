# JSapp React Native Firebase Starter, the Original
![Preview](https://pbs.twimg.com/profile_images/631286882316320768/WaiX_jqN.png)

#### Create and build your React Native / Firebase hybrid iOS and Android app, 0 to 100 (Real Quick)

[![iOS app][2]][1] [![Android app][4]][3]

  [1]: https://itunes.apple.com/us/app/jsapp-my-app/id1165501349?mt=8
  [2]: ./graphics/app-store-badge.png
  [3]: https://play.google.com/store/apps/details?id=me.jsapp.myapp
  [4]: ./graphics/google-play-badge.png  

## Built With
 - [React Native](https://facebook.github.io/react-native/)
 - [Redux](https://github.com/reactjs/redux)
 - [Redux Storage](https://github.com/michaelcontento/redux-storage) (with [async-storage engine](https://github.com/michaelcontento/redux-storage-engine-reactNativeAsyncStorage) for react native for application persistence)
 - [Firebase](https://firebase.google.com/)

I would really appricate any suggestions, feedback, PRs and Issues.

## How to create your own copy of this app?
### Prerequisites
To create an own copy of this application, you have some prerequisites. They are -

 - [NodeJS](https://nodejs.org/en/) installed on your system.
 - [React Native](https://facebook.github.io/react-native/) installed on your system.
 - Have the [Android SDK](https://developer.android.com/studio/index.html) and paths set properly.
 - An android emulator or real device to run the app.
 - A google account for having [Firebase Web](https://firebase.google.com/docs/web/setup) configuration.

### Make own copy
First clone the repository using:

    git clone https://github.com/jsappme/react-native-firebase-starter.git

Then install the dependencies using:

    yarn

At this point you need to have the configurations for a Firebase App. Just go to [Firebase Console](https://firebase.google.com/docs/web/setup) and follow the instructions. Then open the file named `firebase.js` from the `src` folder. Add the Firebase configurations to the file. The file looks something like this:

    // import and configure firebase
    import * as firebase from 'firebase';

    const firebaseConfig = {
      apiKey: [YOUR API KEY],
      authDomain: [YOUR AUTH DOMAIN],
      databaseURL: [YOUR DATABASE URL],
      storageBucket: [STORAGE BUCKET],
    }
    export const firebaseApp = firebase.initializeApp(firebaseConfig)

Then run the React Native server using:

    react-native start

Open your emulator and wait until it completely boot up. Then run the following command to run the app on the emulator.

    react-native run-android

Now, you have your own copy of this application!


##License
[MIT License](https://github.com/jsappme/react-native-firestack-starter/blob/master/LICENSE). Do whatever you want to do.


## Credits
I barely created the application. I just created the front end shell and done some integration with firebase. All the credits goes to all library creators and contributors to those repositories and libraries. I'm really grateful to all of them.

 - [Mister Poster](https://github.com/shoumma/Mister-Poster)
 - [React Native](https://facebook.github.io/react-native/)
 - [React Native Animatable](https://github.com/oblador/react-native-animatable)
 - [React Native Scrollable Tab View](https://github.com/skv-headless/react-native-scrollable-tab-view)
 - [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
 - [Redux](https://github.com/reactjs/redux)
 - [React Redux](https://github.com/reactjs/react-redux)
 - [Redux Storage](https://github.com/michaelcontento/redux-storage)
 - [Redux Storage Engine - React Native Async Storage](https://github.com/michaelcontento/redux-storage-engine-reactNativeAsyncStorage)
 - [Firebase](https://firebase.google.com/)
 - [Moment JS](http://momentjs.com/)
 - [Lodash](https://lodash.com/)


Made with ♥ by [JSapp.me](http://jsapp.me)

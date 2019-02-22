  import firebase from 'firebase'
  import firestore from 'firebase/firestore'
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAxKSwsnpHePoU3DYB13mmSiIT0hvMwTmw",
    authDomain: "order-app-aa036.firebaseapp.com",
    databaseURL: "https://order-app-aa036.firebaseio.com",
    projectId: "order-app-aa036",
    storageBucket: "order-app-aa036.appspot.com",
    messagingSenderId: "701772274845"
  };
  
  const firebaseApp = firebase.initializeApp(config);

  export default firebaseApp.firestore()

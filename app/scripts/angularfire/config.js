// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDeEHtB9db5EQUI9Dp9cR9fMvPSVjW-U4s',
  authDomain: 'test-ca1f8.firebaseapp.com',
  databaseURL: 'https://test-ca1f8.firebaseio.com',
  projectId: 'test-ca1f8',
  storageBucket: 'test-ca1f8.appspot.com',
  messagingSenderId: '230339306250'
};
firebase.initializeApp(config);


angular.module('firebase.config', [])
  .constant('FBURL', 'https://webdan.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','google'])
  .constant('loginRedirectPath', '/login');

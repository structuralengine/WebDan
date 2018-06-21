// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCeB1y4wsj6S9Zb-NnE8gNE937mBnZPcMc',
  authDomain: 'the-structural-engine.firebaseapp.com',
  databaseURL: 'https://the-structural-engine.firebaseio.com',
  projectId: 'the-structural-engine',
  storageBucket: 'the-structural-engine.appspot.com',
  messagingSenderId: '193022928063'
};
firebase.initializeApp(config);


angular.module('firebase.config', [])
  .constant('FBURL', 'https://the-structural-engine.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])
  .constant('loginRedirectPath', '/login');

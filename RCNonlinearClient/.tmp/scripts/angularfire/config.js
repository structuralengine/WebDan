'use strict';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyC0nZsDxgRm9S1ppN_mx0nWcrgL1FF5GFI',
  authDomain: 'webdan-abcc6.firebaseapp.com',
  databaseURL: 'https://webdan-abcc6.firebaseio.com',
  projectId: 'webdan-abcc6',
  storageBucket: 'webdan-abcc6.appspot.com',
  messagingSenderId: '1006569190487'
};
firebase.initializeApp(config);

angular.module('firebase.config', []).constant('FBURL', 'https://webdan.firebaseio.com').constant('SIMPLE_LOGIN_PROVIDERS', ['password', 'google']).constant('loginRedirectPath', '/login');
//# sourceMappingURL=config.js.map

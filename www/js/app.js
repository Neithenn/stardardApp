/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = angular.module('CursandoApp',['ngResource','ngMaterial', 'ngStorage','ui.router', 'btford.socket-io', 'ngMessages']);

app.constant('API_URL', 'http://192.168.0.115:8081/api/');

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider 

    .state('login',{
        url: '/login',
        templateUrl: 'templates/login.html'
    })
    .state('signin',{
        url: '/signin',
        templateUrl: 'templates/signin.html'
    })
    .state('reset',{
        url:'/resetpassword',
        templateUrl: 'templates/reset_password.html'
    })
    .state('dashboard',{
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html',
        resolve: {isLoggedin: function($state, $localStorage){
          
            firebase.auth().onAuthStateChanged(function(user) {
                  if (user) {
                    // User is signed in.
                    if ($localStorage.user.email == undefined){
                        $state.go('login');
                    }
                  } else {
                    // No user is signed in.
                    $state.go('login');
                  }
                });
        }}
    })
    .state('chat',{
        url: '/chat',
        templateUrl: 'templates/chat.html',
        params: {friend: null}
    })
    .state('users_list',{
        url: '/users_list',
        templateUrl: 'templates/users_list.html'
    })

    $urlRouterProvider.otherwise('/dashboard');
})

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');
});


var app2 = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

         FCMPlugin.onNotification(function(data){
            if(data.wasTapped){
              //Notification was received on device tray and tapped by the user. 
              alert( JSON.stringify(data) );
              console.log(JSON.stringify(data) )
            }else{
              //Notification was received in foreground. Maybe the user needs to be notified. 
              alert( JSON.stringify(data) );
            }
        });

         


           var config = {
                apiKey: "AIzaSyC5tkkPfdt-swmIegNIkYseyVfyt9oVSmo",
                authDomain: "cursando-54cdb.firebaseapp.com",
                databaseURL: "https://cursando-54cdb.firebaseio.com",
                projectId: "cursando-54cdb",
                storageBucket: "cursando-54cdb.appspot.com",
                messagingSenderId: "429570965516"
                };
          firebase.initializeApp(config);

           angular.element(document).ready(function () {
            if (window.cordova) {
              document.addEventListener('deviceready', function () {
                angular.bootstrap(document.body, ['CursandoApp']);
              }, false);
            } else {
              angular.bootstrap(document.body, ['CursandoApp']);
            }
          });
        this.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app2.initialize();



//var myApp = new Framework7();

//Angular initialize

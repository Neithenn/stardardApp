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

var app = angular.module('StandardApp',['ngResource', 'ngStorage','ui.router', 'btford.socket-io']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider 

    .state('login',{
        url: '/login',
        templateUrl: 'templates/login.html'
    })

    .state('dashboard',{
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html'
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
                      apiKey: "AIzaSyC8dpd_zcHuia0zieXUW3jVQFDcNIp58jU",
                      authDomain: "standardapp-37abf.firebaseapp.com",
                      databaseURL: "https://standardapp-37abf.firebaseio.com",
                      projectId: "standardapp-37abf",
                      storageBucket: "standardapp-37abf.appspot.com",
                      messagingSenderId: "1018658056483"
                    };
          firebase.initializeApp(config);


          console.log('camera: '+ navigator.camera);
    
           angular.element(document).ready(function () {
            if (window.cordova) {
              document.addEventListener('deviceready', function () {
                angular.bootstrap(document.body, ['StandardApp']);
              }, false);
            } else {
              angular.bootstrap(document.body, ['StandardApp']);
            }
          });
        this.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app2.initialize();



var myApp = new Framework7();

//Angular initialize

app.service('loading', loading);
    loading.$inject = ['$mdDialog', '$rootScope'];
    function loading($mdDialog,  $rootScope){ 
     
     return {
       hideWait: hideWait,
       showWait: showWait
     }
     
     function hideWait(){
          setTimeout(function(){
                   $rootScope.$emit("hide_wait"); 
                },5);
      }
      
     function showWait(){
              $mdDialog.show({
                controller: 'waitCtrl',
                templateUrl: 'templates/dialog-loading.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
              })
              .then(function(answer) {
                
              });
       }
  
    }
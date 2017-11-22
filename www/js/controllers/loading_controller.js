app.controller('waitCtrl', waitCtrl);
    
    waitCtrl.$inject = ['$mdDialog', '$rootScope'];

    function waitCtrl($mdDialog, $rootScope) {
        var vm = this;

       
        
      $rootScope.$on("hide_wait", function (event, args) {
            $mdDialog.cancel();
        }); 
        

    }
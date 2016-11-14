var app = angular.module('datepickerBasicUsage', ['ngMaterial', 'ngMessages']);
app.controller('AppCtrl', function ($scope) {
        $scope.myDate = new Date();

        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() - 2,
            $scope.myDate.getDate());

        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() + 2,
            $scope.myDate.getDate());

        $scope.onlyWeekendsPredicate = function (date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        };
});

app.controller('MyNewController', function ($scope, $mdSidenav) {
    $scope.toggleSidenav = function () {
        $mdSidenav('left-side-nav').toggle();
      };

});



app.controller('AppCtrl2', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                  $log.debug("toggle " + navID + " is done");
              });
        }, 200);

        return debounceFn;
    }

});
 app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
      $scope.close = function () {
          $mdSidenav('left').close()
            .then(function () {
                $log.debug("close LEFT is done");
            });

      };
  })
 app.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
     $scope.close = function () {
         $mdSidenav('right').close()
           .then(function () {
               $log.debug("close RIGHT is done");
           });
     };
 });
 
 app.directive('sidenavPushIn', function () {
      return {
          restrict: 'A',
          require: '^mdSidenav',
          link: function ($scope, element, attr, sidenavCtrl) {
              var body = angular.element(document.body);
              body.addClass('md-sidenav-push-in');
              var cssClass = (element.hasClass('md-sidenav-left') ? 'md-sidenav-left' : 'md-sidenav-right') + '-open';
              var stateChanged = function (state) {
                  body[state ? 'addClass' : 'removeClass'](cssClass);
              };
              // overvwrite default functions and forward current state to custom function
              angular.forEach(['open', 'close', 'toggle'], function (fn) {
                  var org = sidenavCtrl[fn];
                  sidenavCtrl[fn] = function () {
                      var res = org.apply(sidenavCtrl, arguments);
                      stateChanged(sidenavCtrl.isOpen());
                      return res;
                  };
              });
          }
      };
  });

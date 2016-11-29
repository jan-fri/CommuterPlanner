app.controller('MapCtrl', function ($scope) {

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(25, 80),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info) {

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    for (i = 0; i < cities.length; i++) {
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

});

var cities = [
              {
                  city: 'India',
                  desc: 'This is the best country in the world!',
                  lat: 23.200000,
                  long: 79.225487
              },
              {
                  city: 'New Delhi',
                  desc: 'The Heart of India!',
                  lat: 28.500000,
                  long: 77.250000
              },
              {
                  city: 'Mumbai',
                  desc: 'Bollywood city!',
                  lat: 19.000000,
                  long: 72.90000
              },
              {
                  city: 'Kolkata',
                  desc: 'Howrah Bridge!',
                  lat: 22.500000,
                  long: 88.400000
              },
              {
                  city: 'Chennai  ',
                  desc: 'Kathipara Bridge!',
                  lat: 13.000000,
                  long: 80.250000
              }
];






//Angular App Module and Controller



//});
//Map controller
//app.controller('MapController', function ($scope, $timeout) {

//    $scope.map;
//    $scope.markers = [];
//    $scope.markerId = 1;

//    //Map initialization  
//    $timeout(function () {

//        var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
//        var myOptions = {
//            zoom: 8,
//            center: latlng,
//            mapTypeId: google.maps.MapTypeId.ROADMAP
//        };
//        $scope.map = new google.maps.Map(document.getElementById("googleMap"), myOptions);
//        $scope.overlay = new google.maps.OverlayView();
//        $scope.overlay.draw = function () { }; // empty function required
//        $scope.overlay.setMap($scope.map);
//        $scope.element = document.getElementById('googleMap');
//        $scope.hammertime = Hammer($scope.element).on("hold", function (event) {
//            $scope.addOnClick(event);
//        });

//    }, 100);
//});

app.controller('PlanController', function ($scope) {
    $scope.myDate = new Date();
    $scope.time;
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
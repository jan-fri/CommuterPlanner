app.controller('PlanController', ['$rootScope', '$scope', 'BusStopService', 'DataDisplayService', 'RouteSelectionService', '$filter', function ($rootScope, $scope, BusStopService, DataDisplayService, RouteSelectionService, $filter) {

    $scope.selectedDate = new Date();
    $scope.selectedTime = new Date();
    
    //all available bus stop data
    var allStops;
    //bus stops in cities
    var cityList;

    $scope.$on('dataReady', function (event, obj) {
        console.log("planContr init");
        init();
    });

    init = function () {
        allStops = BusStopService.getBusData();
        getCities();
    };

    var getCities = function () {
        //names of available cities to display
        $scope.cityNames = new Array();

        cityList = DataDisplayService.getCities(allStops, $scope.cityNames);
       // console.log("cityList in plan contr " + cityList);
       // console.log("citiesList in plan contr " + $scope.cityNames);
    };

    $scope.selectCity = function (index, selector) {
        if (selector == 'start') {
            $scope.startCity = Object.keys(cityList[index])[0];
            $scope.busStopsStart = DataDisplayService.getStops(cityList, $scope.startCity);
        }
        else if (selector == 'end') {
            $scope.endCity = Object.keys(cityList[index])[0];
            $scope.busStopsEnd = DataDisplayService.getStops(cityList, $scope.endCity);
        }
    };

    $scope.selectBusStop = function (selector, busStop) {
        if (selector == 'start') {
            $scope.startBusStop = busStop;
           // console.log("start selected bus stop is" + $scope.startBusStop);
        }
        else if (selector == 'end') {
            $scope.endBusStop = busStop;
           // console.log("end selected bus stop is" + $scope.endBusStop);
        }
    };


    

    $scope.getStopRefs = function () {
        if ($scope.startBusStop != 'undefined' && $scope.endBusStop != 'undefined') {
            $scope.routes = new Array();
            var startStopRefs = DataDisplayService.getRefs(cityList, $scope.startCity, $scope.startBusStop);
            var endStopRefs = DataDisplayService.getRefs(cityList, $scope.endCity, $scope.endBusStop);

            RouteSelectionService.receiveRoutes(startStopRefs, endStopRefs, $filter('date')($scope.selectedDate, 'EEEE'), $filter('date')($scope.selectedTime, 'HH:mm')).then(
                function (data) {
                    getRoutes(data);
                });
        }
    };

    var getRoutes = function (data) {

        for (var i = 0; i < data.length; i++) {
            $scope.routes.push({
                index: i + 1,
                changes: data[i]['busChanges'],
                details: {
                    busStopName: data[i]['busStopNameList'],
                    busStopCity: data[i]['busStopCity'],
                    busStopRef: data[i]['busStopRefList'],
                    busNumber: data[i]['busNumber'],
                    arrivalTime: data[i]['arrivalTime'],
                    busStopCoordinates: data[i]['coordinates']
                },
            });
        }
        //console.log($scope.routes);
    };

    $scope.sendCoordinatesToMap = function (index) {
        $scope.$emit("sendCoordin", {
            coordinates: $scope.routes[index]['details']['busStopCoordinates'],
            busStopName: $scope.routes[index]['details']['busStopName'],
            busStopRef: $scope.routes[index]['details']['busStopRef'],
            busStopCity: $scope.routes[index]['details']['busStopCity']
        });
    };

    $scope.selectStartLocation = function () {
        $scope.$emit('selectStartLocation', { enableClickStart: true });
    };

    $scope.selectEndLocation = function () {
        $scope.$emit('selectEndLocation', { enableClickEnd: true });
    };

    $scope.$on('startLocationSelected', function (event, obj) {
        for (var i = 0; i < $scope.cityNames.length; i++) {
            if (obj.cityName == $scope.cityNames[i]) {
                $scope.startCity = $scope.cityNames[i];
                break;
            }
        }
        var busStopName = DataDisplayService.getBusStopNamebyRef(cityList, $scope.startCity, obj.busStopRef);
        $scope.busStopsStart = DataDisplayService.getStops(cityList, $scope.startCity);

        for (var i = 0; i < $scope.busStopsStart.length; i++) {
            if (busStopName == $scope.busStopsStart[i]) {
                $scope.startBusStop = $scope.busStopsStart[i];
                break;
            }
        };

        $scope.$apply();
    });

    $scope.$on('endLocationSelected', function (event, obj) {
        for (var i = 0; i < $scope.cityNames.length; i++) {
            if (obj.cityName == $scope.cityNames[i]) {
                $scope.endCity = $scope.cityNames[i];
                break;
            }
        }
        var busStopName = DataDisplayService.getBusStopNamebyRef(cityList, $scope.endCity, obj.busStopRef);
        $scope.busStopsEnd = DataDisplayService.getStops(cityList, $scope.endCity);

        for (var i = 0; i < $scope.busStopsEnd.length; i++) {
            if (busStopName == $scope.busStopsEnd[i]) {
                $scope.endBusStop = $scope.busStopsEnd[i];
                break;
            }
        };

        $scope.$apply();
    });
}]);
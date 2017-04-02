app.controller('PlanController', ['$rootScope', '$scope', 'BusStopService', 'DataDisplayService', 'RouteSelectionService', '$filter', function ($rootScope, $scope, BusStopService, DataDisplayService, RouteSelectionService, $filter) {

    $scope.selectedDate = new Date();
    $scope.selectedTime;

    //all available bus stop data
    var allStops;
    //bus stops in cities
    var cityBusStopList;

    $scope.$on('dataReady', function (event, obj) {
        init();
    });

    init = function () {
        console.log("plan controller");
        //BusStopService.receiveBusData().then(
        //    function (data) {
        //        console.log("data received");
        //        //init2();
        //        allStops = BusStopService.getBusData();
        //        getCities();
        //    },
        //    function () {
        //        alert('error while fetching data from server')
        //    });

        allStops = BusStopService.getBusData();
        getCities();
    };

    var getCities = function () {
        //names of available cities to display
        $scope.cityNames = new Array();

        cityBusStopList = DataDisplayService.getCities(allStops, $scope.cityNames);
        console.log("cityBusStopList in plan contr " + cityBusStopList);
        console.log("citiesList in plan contr " + $scope.cityNames);
    };

    //variable used to prevent calling fuction multiple times (!digest loop error)
    var iterations = 0;

    var IsSelectedStartStop = false;
    var IsSelectedEndStop = false;



    //index number of selected city from list 
    var cityStartIndex = 0;
    //index number of selected city from list 
    var cityEndIndex = 0;
    //name of selected city
    var selectedStartCity;
    //name of selected city
    var selectedEndCity;


    $scope.selectCity = function (index, selector) {
        if (selector == 'start') {
            cityStartIndex = index;
            //  IsSelectedStartCity = true;
            selectedStartCity = Object.keys(cityBusStopList[index])[0];
            // console.log("city selected " + selectedStartCity);
            $scope.busStopsStart = DataDisplayService.getStops(cityBusStopList, selectedStartCity);
            //console.log("bus stops extracted");
        }
        else if (selector == 'end') {
            cityEndIndex = index;
            //  IsSelectedEndCity = true;
            selectedEndCity = Object.keys(cityBusStopList[index])[0];
            $scope.busStopsEnd = DataDisplayService.getStops(cityBusStopList, selectedEndCity);
        }
    };

    //   $scope.startBusStop;
    $scope.endBusStop;


    $scope.selectBusStop = function (selector, busStop) {
        if (selector == 'start') {
            // IsSelectedStartStop = true;
            // selectedBusStopStart = busStop;
            $scope.startBusStop = busStop;
            console.log("start selected bus stop is" + $scope.startBusStop);
        }
        else if (selector == 'end') {
            //  IsSelectedEndStop = true;
            // selectedBusStopEnd = busStop;
            console.log("end selected bus stop is" + $scope.endBusStop);
        }
    };


    $scope.routes = new Array();

    $scope.getStopRefs = function () {
        if ($scope.startBusStop != 'undefined' && $scope.endBusStop != 'undefined') {
            var startStopRefs = DataDisplayService.getRefs(cityBusStopList, selectedStartCity, $scope.startBusStop);
            endStopRefs = DataDisplayService.getRefs(cityBusStopList, selectedEndCity, $scope.endBusStop);
            console.log("startStopRefs" + startStopRefs);
            console.log("endStopRefs" + endStopRefs);

            console.log("weekday " + $filter('date')($scope.selectedDate, 'EEEE'));
            console.log("time " + $scope.selectedTime);

            RouteSelectionService.receiveRoutes(startStopRefs, endStopRefs, $filter('date')($scope.selectedDate, 'EEEE'), $scope.selectedTime).then(
                function (data) {
                    console.log("data");
                    console.log(data);
                    getRoutes(data);
                });
        }
    };

    var getRoutes = function (data) {
        console.log("get routes :");

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
        console.log("routes received ");
        console.log($scope.routes);
    };

    $scope.sendCoordinatesToMap = function (index) {
        console.log("sending coordinates ");
        console.log($scope.routes[index]['details']['busStopName']);
        console.log($scope.routes[index]['details']['busStopRef']);
        console.log($scope.routes[index]['details']['busStopCoordinates']);
        console.log($scope.routes[index]['details']['busStopCity']);
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
        var busStopName = DataDisplayService.getBusStopNamebyRef(cityBusStopList, $scope.startCity, obj.busStopRef);
        $scope.busStopsStart = DataDisplayService.getStops(cityBusStopList, $scope.startCity);

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
        var busStopName = DataDisplayService.getBusStopNamebyRef(cityBusStopList, $scope.endCity, obj.busStopRef);
        $scope.busStopsEnd = DataDisplayService.getStops(cityBusStopList, $scope.endCity);

        for (var i = 0; i < $scope.busStopsEnd.length; i++) {
            if (busStopName == $scope.busStopsEnd[i]) {
                $scope.endBusStop = $scope.busStopsEnd[i];
                break;
            }
        };

        $scope.$apply();
    });
}]);
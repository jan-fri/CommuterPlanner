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
            $scope.busStopsStart = DataDisplayService.getStops(cityBusStopList, cityStartIndex, selectedStartCity);
            //console.log("bus stops extracted");
        }
        else if (selector == 'end') {
            cityEndIndex = index;
            //  IsSelectedEndCity = true;
            selectedEndCity = Object.keys(cityBusStopList[index])[0];
            $scope.busStopsEnd = DataDisplayService.getStops(cityBusStopList, cityEndIndex, selectedEndCity);
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
            var startStopRefs = DataDisplayService.getRefs(cityBusStopList, cityStartIndex, selectedStartCity, $scope.startBusStop);
            endStopRefs = DataDisplayService.getRefs(cityBusStopList, cityEndIndex, selectedEndCity, $scope.endBusStop);
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
                    busStopRef: data[i]['busStopRefList'],
                    busNumber: data[i]['busNumber'],
                    arrivalTime: data[i]['arrivalTime'],
                    busStopCoordinates: data[i]['coordinates']
                },
            });
        }
        console.log($scope.routes);
    };

    $scope.sendCoordinatesToService = function (index) {
        console.log("sending coordinates ");
        console.log($scope.routes[index]['details']['busStopName']);
        console.log($scope.routes[index]['details']['busStopRef']);
        $scope.$emit("sendCoordin", {
            coordinates: $scope.routes[index]['details']['busStopCoordinates'],
            busStopName: $scope.routes[index]['details']['busStopName'],
            busStopRef: $scope.routes[index]['details']['busStopRef']
        });

        //    var da = new Array();
        //    da.push({
        //        busStopName: ["hotel prezydent", "partyzantow apena", "Żywiecka Hotel", "lenartowicza", "Jutrzenki-Sam"],
        //        coordinates: ["49.8236529, 19.0449636", "49.848266, 19.0452707", "49.8064226, 19.056156", "49.8117055, 19.0568656", "49.8112987, 19.0620607"]
        //    });
        //    da.push({
        //        busStopName: ["Hotel Prezydent", "Dmowskiego Urząd Miejski", "Żywiecka Osiedle Grunwaldzkie", "Lenartowicza", "Jutrzenki-Sam"],
        //        coordinates: ["49.8234083, 19.0448538", "49.8201898, 19.051539", "49.8149968, 19.0556383", "49.8117055, 19.0568656", "49.8112987, 19.0620607"]
        //    });
        //    da.push({
        //        busStopName: ["Hotel Prezydent", "3 Maja Dworzec", "Bora-Komorowskiego Gemini Park", "Osiedle Złote Łany", "Jutrzenki-Sam"],
        //        coordinates: ["49.8236529, 19.0449636", "49.8277174, 19.0447992", "49.8036574, 19.0495596", "49.8061335, 19.0625326", "49.8113982, 19.0622099"]
        //    });
        //    da.push({
        //        busStopName: ["Hotel Prezydent", "Partyzantów Apena", "Partyzantów Folwark", "Bora-Komorowskiego Gemini Park", "Osiedle Złote Łany", "Jutrzenki-Sam"],
        //        coordinates: ["49.8234083, 19.0448538", "49.8088719, 19.0429593", "49.858266, 19.0552707", "49.8036574, 19.0495596", "49.8061335, 19.0625326", "49.8113982, 19.0622099"]
        //    });

        //    $scope.$emit('sendCoordin', { coordinates: da[index]['coordinates'], busStopName: da[index]['busStopName'] });
    };

    $scope.selectStartLocation = function () {
        $scope.$emit('selectStartLocation', { enableClickStart: true });
    };

    $scope.$on('startLocationSelected', function (event, obj) {
        console.log("da received " + obj.cityName);
        $scope.startCity = obj.cityName;
        console.log("start loc selec reff " + obj.busStopRef);
        $scope.busStopsStart = DataDisplayService.getStops(cityBusStopList, cityStartIndex, $scope.startCity);

        for (var i = 0; i < $scope.busStopsStart.length; i++) {
           // console.log($scope.busStopsStart[i]);
            if (obj.busStopName == $scope.busStopsStart[i]) {
                $scope.startBusStop = $scope.busStopsStart[i];
                break;
            }
        };
        console.log();
        console.log("stop " + obj.busStopName);
        console.log($scope.startBusStop);
        $scope.$apply();
    });
}]);
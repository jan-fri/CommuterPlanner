app.controller('PlanController', ['$rootScope', '$scope', 'BusStopService', 'DataDisplayService', 'RouteSelectionService', '$filter', function ($rootScope, $scope, BusStopService, DataDisplayService, RouteSelectionService, $filter) {

    $scope.selectedDate = new Date();
    $scope.selectedTime;

    $scope.test = function () {
        console.log("time " + $filter('date')($scope.selectedDate, 'EEEE') + "date     " + $scope.selectedTime)
    };
    //list of all available cities 
    var cities;
    //variable used to prevent calling fuction multiple times (!digest loop error)
    var iterations = 0;
    //index number of selected city from list 
    var cityNoStart = 0;
    //index number of selected city from list 
    var cityNoEnd = 0;
    //name of selected city
    var selectedStartCity;
    //name of selected city
    var selectedEndCity;
    //name of selected bus stop
    var selectedBusStopStart;
    //name of selected bus stop
    var selectedBusStopEnd;
    //list of all stops is given city
    var cityStartStops;
    //list of all stops is given city
    var cityEndStops;

    var startStopRefs;
    var endStopRefs;

    var citieslist;


    var IsSelectedStartCity = false;
    var IsSelectedEndCity = false;
    var IsSelectedStartStop = false;
    var IsSelectedEndStop = false;

    $scope.routes = new Array();

    init = function () {
        console.log("toolbar controller2");
        BusStopService.receiveBusData().then(
            function (data) {
                console.log("data received");
                init2();
            },
            function () {
                alert('error while fetching data444from server')
            });
    };

    init2 = function () {
        var stops = BusStopService.getBusData();
        console.log("get city in plan contr");
        console.log(stops);
        if (typeof (stops) == "undefined") {

            console.log("undefined");
            init2();
        }

        citieslist = new Array();
        cities = DataDisplayService.getCities(stops, citieslist);
    };

    //reads all available cities from data
    $scope.getCities = function () {
        return citieslist;
    };

    $scope.selectCity = function (index, selector) {
        if (selector == 'start') {
            console.log("is start city");
            cityNoStart = index;
            IsSelectedStartCity = true;
            selectedStartCity = Object.keys(cities[index])[0];
            cityStartStops = DataDisplayService.getStops(cities, cityNoStart, selectedStartCity);
        }
        else if (selector == 'end') {
            console.log("is end city");
            cityNoEnd = index;
            IsSelectedEndCity = true;
            selectedEndCity = Object.keys(cities[index])[0];
            cityEndStops = DataDisplayService.getStops(cities, cityNoEnd, selectedEndCity);
        }
    };

    $scope.getBusStopStart = function (city) {
        if (IsSelectedStartCity) {
            console.log("get bus stop start");
            return cityStartStops;
        }
    };

    $scope.getBusStopEnd = function (city) {
        if (IsSelectedEndCity) {
            console.log("get bus stop end");
            return cityEndStops;
        }
    };

    $scope.selectBusStop = function (busStop, selector) {
        if (selector == 'start') {
            IsSelectedStartStop = true;
            selectedBusStopStart = busStop;
            console.log("start " + busStop);
        }
        else if (selector == 'end') {
            IsSelectedEndStop = true;
            selectedBusStopEnd = busStop;
            console.log("end " + busStop);
        }
    };

    $scope.getStopRefs = function () {
        if (IsSelectedStartStop && IsSelectedEndStop) {


            startStopRefs = DataDisplayService.getRefs(cities, cityNoStart, selectedStartCity, selectedBusStopStart);
            endStopRefs = DataDisplayService.getRefs(cities, cityNoEnd, selectedEndCity, selectedBusStopEnd);
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
                    busNumber: data[i]['busNumber'],
                    arrivalTime: data[i]['arrivalTime'],
                    busStopCoordinates: data[i]['coordinates']
                },
            });
        }
        return $scope.routes;
    };

    $scope.sendCoordinatesToService = function (index) {
        $scope.$emit("sendCoordin", {
            coordinates: $scope.routes[index]['details']['busStopCoordinates'],
            busStopName: $scope.routes[index]['details']['busStopName']
        });

        //var da = new Array();
        //da.push({
        //    busStopName: ["hotel prezydent", "partyzantow apena", "zywiecka hotel", "lenartowicza", "jutrzenki sam"],
        //    coordinates: ["49.8236529, 19.0449636", "49.848266, 19.0452707", "49.8064226, 19.056156", "49.8117055, 19.0568656", "49.8112987, 19.0620607"]
        //});
        //da.push({
        //    busStopName: ["Hotel Prezydent", "Dmowskiego Urząd Miejski", "Żywiecka Osiedle Grunwaldzkie", "Lenartowicza", "Jutrzenki SAM"],
        //    coordinates: ["49.8234083, 19.0448538", "49.8201898, 19.051539", "49.8149968, 19.0556383", "49.8117055, 19.0568656", "49.8112987, 19.0620607"]
        //});
        //da.push({
        //    busStopName: ["Hotel Prezydent", "3 Maja Dworzec", "Bora-Komorowskiego Gemini Park", "Osiedle Złote Łany", "Jutrzenki SAM"],
        //    coordinates: ["49.8236529, 19.0449636", "49.8277174, 19.0447992", "49.8036574, 19.0495596", "49.8061335, 19.0625326", "49.8113982, 19.0622099"]
        //});
        //da.push({
        //    busStopName: ["Hotel Prezydent", "Partyzantów Apena", "Partyzantów Folwark", "Bora-Komorowskiego Gemini Park", "Osiedle Złote Łany", "Jutrzenki SAM"],
        //    coordinates: ["49.8234083, 19.0448538", "49.8088719, 19.0429593", "49.858266, 19.0552707", "49.8036574, 19.0495596", "49.8061335, 19.0625326", "49.8113982, 19.0622099"]
        //});

        //$scope.$emit('sendCoordin', { coordinates: da[index]['coordinates'], busStopName: da[index]['busStopName'] });
    };

    $scope.selectStartLocation = function () {
        $scope.$emit('selectStartLocation', { enableClickStart: true });
    };

    $scope.$on('startLocationSelected', function (event, obj) {
        console.log("da received " + obj.cityName);
        $scope.startCity = obj.cityName;
        cityStartStops = DataDisplayService.getStops(cities, cityNoStart, $scope.startCity);
        $scope.getBusStopStart($scope.startCity);
        $scope.startBusStop = obj.busStopName;

        console.log($scope.startBusStop);
        $scope.$apply();
    });

    init();
}]);
app.controller('AppCtrl', function ($scope) {

});




app.controller('MapController', ['$rootScope', function ($scope, $rootScope) {

    var map = L.map('mapid').setView([49.822, 19.058], 13);

    L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //L.marker([49.822, 19.058]).addTo(map)
    //    .bindPopup('Bielsko-Biała.')
    //    .openPopup();

    //L.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().addTo(map);

    //var circle = L.circle([49.822, 19.058], {
    //    color: 'blue',
    //    fillColor: '#f03',
    //    fillOpacity: 0.5,
    //    radius: 200
    //}).addTo(map);

    //var popup = L.popup()
    //.setLatLng([49.822, 19.058])
    //.setContent("I am a standalone popup.")
    //.openOn(map);

    var coordinates;
    var busStopNames;
    var stopArray = new Array();
    var stopLayer = L.layerGroup();
    var popupArray = new Array();
    var popupLayer = L.layerGroup();
    var lineRouteArray = new Array();
    var lineRouteLayer = L.layerGroup();

    $scope.$on("sendCoordin", function (event, obj) {
        coordinates = obj['coordinates']
        busStopNames = obj['busStopName'];
        showRoute();

    });

    var showRoute = function () {
        console.log("stoparray chek " + stopArray[0]);
        if (typeof stopArray[0] != 'undefined') {
            console.log("cecking " + stopArray);
            stopArray = [];
            popupArray = [];
            lineRouteArray = [];
            map.removeLayer(stopLayer);
            map.removeLayer(popupLayer);
            map.removeLayer(lineRouteLayer);
        }

        var style = { color: 'blue' }
        for (var i = 0; i < coordinates.length; i++) {
            var str = coordinates[i].split(", ");
            console.log(str[0], str[1]);
            var stop = L.circleMarker([str[0], str[1]], {
                color: 'blue',
                fillColor: '#f03',
                fillOpacity: 0.5,
            }).bindPopup(busStopNames[i]);

            stopArray.push(stop);

            if (i == 0 || i == coordinates.length - 1) {
                var popup = L.popup()
                                .setLatLng([str[0], str[1]])
                                .setContent(busStopNames[i]);
                popupArray.push(popup);
            }

            lineRouteArray.push([str[0], str[1]]);
        }
        console.log("ba,");
        console.log(lineRouteArray);

        stopLayer = L.layerGroup(stopArray).addTo(map);
        popupLayer = L.layerGroup(popupArray).addTo(map);

        lineRouteLayer = L.polyline(lineRouteArray);
        map.addLayer(lineRouteLayer);
    };
}]);

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
                alert('error while fetching data from server')
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
        //$scope.$emit("sendCoordin", {
        //    coordinates: $scope.routes[index]['details']['busStopCoordinates'],
        //    busStopName: $scope.routes[index]['details']['busStopName']
        //});

        var da = new Array();
        da.push({
            busStopName: ["hotel prezydent", "partyzantow apena", "zywiecka hotel", "lenartowicza", "jutrzenki sam"],
            coordinates: ["49.8236529, 19.0449636", "49.848266, 19.0452707", "49.8064226, 19.056156", "49.8117055, 19.0568656", "49.8112987, 19.0620607"]
        });
        da.push({
            busStopName: ["Hotel Prezydent", "Dmowskiego Urząd Miejski", "Żywiecka Osiedle Grunwaldzkie", "Lenartowicza", "Jutrzenki SAM"],
            coordinates: ["49.8234083, 19.0448538", "49.8201898, 19.051539", "49.8149968, 19.0556383", "49.8117055, 19.0568656", "49.8112987, 19.0620607"]
        });
        da.push({
            busStopName: ["Hotel Prezydent", "3 Maja Dworzec", "Bora-Komorowskiego Gemini Park", "Osiedle Złote Łany", "Jutrzenki SAM"],
            coordinates: ["49.8236529, 19.0449636", "49.8277174, 19.0447992", "49.8036574, 19.0495596", "49.8061335, 19.0625326", "49.8113982, 19.0622099"]
        });
        da.push({
            busStopName: ["Hotel Prezydent", "Partyzantów Apena", "Partyzantów Folwark", "Bora-Komorowskiego Gemini Park", "Osiedle Złote Łany", "Jutrzenki SAM"],
            coordinates: ["49.8234083, 19.0448538", "49.8088719, 19.0429593", "49.858266, 19.0552707", "49.8036574, 19.0495596", "49.8061335, 19.0625326", "49.8113982, 19.0622099"]
        });

        $scope.$emit("sendCoordin", { coordinates: da[index]['coordinates'], busStopName: da[index]['busStopName'] });
    };

    init();
}]);

app.controller('ToolbarController', ['$scope', '$mdSidenav', '$mdPanel', 'BusStopService', function ($scope, $mdSidenav, $mdPanel, BusStopService) {
    //init = function () {
    //    console.log("toolbar controller1");
    //    BusStopService.receiveBusData().then(
    //        function (data) {
    //        },
    //        function () {
    //            alert('error while fetching speakers from server')
    //        });
    //};

    $scope.toggleSidenav = function (side) {
        $mdSidenav(side).toggle();
    };

    $scope.showPanel = function () {

        var position = $mdPanel.newPanelPosition()
             .absolute()
             //.top('10%')
             .center();

        var config = {
            attachTo: angular.element(document.body),
            controller: 'PanelController',
            // controllerAs: 'ctrl',
            // disableParentScroll: this.disableParentScroll,
            templateUrl: '/Content/Custom/panel2.html',
            //templateUrl: '/Views/Home/Panel/panel.html',
            hasBackdrop: true,
            panelClass: 'demo-dialog-example',
            position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true
        };
        $mdPanel.open(config);
    };

    //init();
}]);



app.controller('PanelController', ['$scope', '$mdPanel', 'BusStopService', 'TimeTableService', 'DataDisplayService', function ($scope, $mdPanel, BusStopService, TimeTableService, DataDisplayService) {

    $scope.stops = BusStopService.getBusData();

    //list of all available cities 
    var cities;
    //index number of selected city from list 
    var cityNo = 0;
    //name of selected city
    var selectedCity;
    //list of all stops is given city
    var cityStops;

    //variable used to prevent calling fuction multiple times (!digest loop error)
    var iterations = 0;

    //set index number of selected city
    $scope.selectCity = function (index) {
        console.log("index num " + index);
        cityNo = index;
        iterations = 0;
        $scope.busLineDetails = [];
    };

    //calls getRelation() with name of selected stop
    $scope.selectStop = function (name) {
        console.log("selectStop");
        iterations = 0;
        getRelation(name);
        $scope.busLineDetails = [];
    };

    //reads all available cities from data
    $scope.getCities = function () {

        $scope.citieslist = new Array();
        cities = DataDisplayService.getCities($scope.stops, $scope.citieslist);
        console.log("stops " + $scope.stops);
        console.log("get cities " + cities);
        return $scope.citieslist;
    };

    //reads stops in selected city
    $scope.getStops = function () {

        var stopList = new Array();

        selectedCity = Object.keys(cities[cityNo])[0];
        cityStops = cities[cityNo][selectedCity];

        stopList = DataDisplayService.getStops(cities, cityNo, selectedCity);

        //checks if getRelation() was already called, used to prevent calling fuction multiple times (!digest loop error)
        if (iterations == 0) {
            getRelation(stopList[0]);
        }
        return stopList;

    };

    //reads all available bus lines for selected bus stop
    var getRelation = function (stopName) {
        console.log("getRelation");
        iterations++;

        $scope.busLines = [];
        $scope.busNumbers = [];
        //console.log("stop name " + stopName);
        //console.log("city stops " + cityStops + "length " + cityStops.length);

        //DataDisplayService.getRelations($scope.busLines, $scope.busNumbers, cityStops, stopName)
        for (var i = 0; i < cityStops.length; i++) {

            if (cityStops[i]['tags']['name'] == stopName) {
                for (var j = 0; j < cityStops[i]['tags']['relation'].length; j++) {
                    var line = cityStops[i]['tags']['relation'][j]['line'];
                    $scope.busLines.push({
                        line: line,
                        route: cityStops[i]['tags']['relation'][j]['route'],
                        stopRef: cityStops[i]['tags']['ref']
                    });

                    //avoids printing duplicates in bus lines list
                    if (!$scope.busNumbers.includes(line)) {
                        $scope.busNumbers.push(line);
                    }
                }
            }
        }

        //console.log("lines");
        //console.log($scope.busLines);
    };

    //show details for selected bus line
    $scope.seletBus = function (index) {

        $scope.busLineDetails = [];
        for (var i = 0; i < $scope.busLines.length; i++) {
            if ($scope.busLines[i]['line'] == $scope.busNumbers[index]) {
                $scope.busLineDetails.push({
                    line: $scope.busLines[i]['line'],
                    route: $scope.busLines[i]['route'],
                    stopRef: $scope.busLines[i]['stopRef']
                });
            }
        };

        //console.log($scope.busLineDetails);
        //console.log("dlugosc");
        //console.log($scope.busLineDetails.length);


        //$scope.busTimeTable = TimeTableService.receiveTimeTableData($scope.busLineDetails);
        $scope.busTimeTable = [];
        for (var i = 0; i < $scope.busLineDetails.length; i++) {
            console.log($scope.busLineDetails[i]);
            TimeTableService.receiveTimeTableData($scope.busLineDetails[i]).then(
                function (data) {
                    console.log("tt data");
                    console.log(data);
                    $scope.busTimeTable.push({
                        workingDay: data[0],
                        saturday: data[1],
                        sunday: data[2]
                    });
                    //console.log("workingDay");
                    //console.log($scope.busTimeTable[0].workingDay);
                },
                function () {
                    alert('error while fetching speakers from server')
                });
        };

    }
}]);
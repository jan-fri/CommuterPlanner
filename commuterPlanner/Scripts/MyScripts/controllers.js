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




app.controller('MapController', function ($scope) {

    var map = L.map('mapid').setView([49.822, 19.058], 13);

    L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([49.822, 19.058]).addTo(map)
        .bindPopup('Bielsko-Biała.')
        .openPopup();
});

app.controller('PlanController', ['$rootScope', '$scope', 'BusStopService', 'DataDisplayService', 'RouteSelectionService', function ($rootScope, $scope, BusStopService, DataDisplayService, RouteSelectionService) {
    $scope.myDate = new Date();
    $scope.time;

    
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
        else if (selector == 'end')
        {
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

            RouteSelectionService.receiveRoutes(startStopRefs, endStopRefs).then(
                function (data) {
                    console.log("data");
                    console.log(data);
                    //var tempRoutes = data;
                    //console.log(routes[0]['busNumber']);
                    //console.log(routes[1]['busStopList']);
                    //console.log(routes[2]['busStopList'][0]);
                    //console.log(routes[3]);
                    //$scope.routes = new Array();
                    //for (var i = 0; i < data.length; i++) {
                    //    routes.push({
                    //        busChanges: data['busChanges'],

                    //    });
                    //}
                });


            //$scope.$watch('routes', function () {
            //    console.log("routes fin ");
            //    console.log($scope.routes);
            //});
        }
        getRoutes();
    };

    var getRoutes = function () {
        console.log("get routes :");
        $scope.routes = new Array();
        var v = new Array();

        var s1 = "Trasa nr 1"
        var s2 = "przystanek numer jeden (linia 1) -> ";
        var s25 = "przystanek numer dwa (linia 1) -> ";
        var s26 = "przystanek numer trzy (linia 32)";
        var s3 = "illosc przesiadek: 2";

        var d1 = "Trasa nr 1"
        var d2 = "przystanek numer jeden (linia 1) -> ";
        var d25 = "przystanek numer dwa (linia 1) -> ";
        var d26 = "przystanek numer trzy (linia 32)";
        var d3 = "illosc przesiadek: 2";

        var s5 = new Array();
        var d5 = new Array();

        s5.push(s2);
        s5.push(s25);
        s5.push(s26);

        $scope.routes.push({
            index: s1,
            details: s5,
            changes: s3
        });

        d5.push(d2);
        d5.push(d25);
        d5.push(d26);

        $scope.routes.push({
            index: d1,
            details: d5,
            changes: d3
        });


        return $scope.routes;
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


        $scope.busTimeTable = TimeTableService.receiveTimeTableData($scope.busLineDetails);
        //$scope.busTimeTable = [];
        //for (var i = 0; i < $scope.busLineDetails.length; i++) {
        //    console.log($scope.busLineDetails[i]);
        //    TimeTableService.receiveTimeTableData($scope.busLineDetails[i]).then(
        //        function (data) {
        //            console.log("data");
        //            console.log(data);
        //            $scope.busTimeTable.push({
        //                workingDay: data[0],
        //                saturday: data[1],
        //                sunday: data[2]
        //            });
        //            console.log("workingDay");
        //            console.log($scope.busTimeTable[0].workingDay);
        //        },
        //        function () {
        //            alert('error while fetching speakers from server')
        //        });            
        //};

    }   
}]);
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

app.controller('PlanController', ['$scope', 'BusStopService', 'DataDisplayService', function ($scope, BusStopService, DataDisplayService) {
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
        }
    };

   init();
}]);

app.controller('ToolbarController', ['$scope', '$mdSidenav', '$mdPanel', 'BusStopService', function ($scope, $mdSidenav, $mdPanel, BusStopService) {
    init = function () {
        console.log("toolbar controller1");
        BusStopService.receiveBusData().then(
            function (data) {
            },
            function () {
                alert('error while fetching speakers from server')
            });
    };

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
        //cities = $scope.stops['busStops'];
        //for (var i = 0; i < cities.length; i++) {
        //    $scope.citieslist.push(Object.keys(cities[i])[0]);
        //}

        return $scope.citieslist;
    };

    //reads stops in selected city
    $scope.getStops = function () {

        $scope.stopList = new Array();

        selectedCity = Object.keys(cities[cityNo])[0];
        cityStops = DataDisplayService.getStops(cities, cityNo, selectedCity, cityStops, $scope.stopList)
       // cityStops = cities[cityNo][selectedCity];

        //for (var i = 0; i < cityStops.length; i++) {
        //    var busStop = cityStops[i]['tags']['name'];

        //    //avoids printing duplicates in bus stop list
        //    if (!$scope.stopList.includes(busStop)) {
        //        $scope.stopList.push(busStop);
        //    }
        //}

        //checks if getRelation() was already called, used to prevent calling fuction multiple times (!digest loop error)
        if (iterations == 0) {
            getRelation($scope.stopList[0]);
        }

        return $scope.stopList;

    };

    //reads all available bus lines for selected bus stop
    var getRelation = function (stopName) {
        console.log("getRelation");
        iterations++;

        $scope.busLines = [];
        $scope.busNumbers = [];

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

        console.log("lines");
        console.log($scope.busLines);
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

        console.log($scope.busLineDetails);
        console.log("dlugosc");
        console.log($scope.busLineDetails.length);

        $scope.busTimeTable = [];
        for (var i = 0; i < $scope.busLineDetails.length; i++) {
            console.log($scope.busLineDetails[i]);
            TimeTableService.receiveTimeTableData($scope.busLineDetails[i]).then(
                function (data) {
                    console.log("data");
                    console.log(data);
                    $scope.busTimeTable.push({
                        workingDay: data[0],
                        saturday: data[1],
                        sunday: data[2]
                    });
                    console.log("workingDay");
                    console.log($scope.busTimeTable[0].workingDay);
                },
                function () {
                    alert('error while fetching speakers from server')
                });            
        };



    }
    //BusStopService.getBusData().then(
    //        function (data) {
    //        },
    //        function () {
    //            alert('error while fetching speakers from server')
    //        });
    //$scope.stops = {
    //    "busStops": [
    //    {
    //        "Bielsko Biała": [{
    //            "type": "node",
    //            "id": 1437869030,
    //            "lat": 49.8123892,
    //            "lon": 19.0661571,
    //            "tags": {
    //                "name": "Osiedle Langiewicza",
    //                "relation": [
    //                    { "line": "15", "route": "Osiedle Polskich Skrzydeł" },
    //                    { "line": "34", "route": "Jakis kierunek" }],
    //                "ref": "328"
    //            }
    //        },
    //        {
    //            "type": "node",
    //            "id": 1437869030,
    //            "lat": 49.8123892,
    //            "lon": 19.0661571,
    //            "tags": {
    //                "name": "Osiedle Langiewicza",
    //                "relation": [
    //                    { "line": "15", "route": "Return" },
    //                    { "line": "34", "route": "New" }],
    //                "ref": "329"
    //            }
    //        },
    //    {
    //        "type": "node",
    //        "id": 259977929,
    //        "lat": 49.8125139,
    //        "lon": 19.0557542,
    //        "tags": {
    //            "name": "Żywiecka Osiedle Grunwaldzkie",
    //            "relation": [
    //                 { "line": "15", "route": "Langiewicza" },
    //                 { "line": "34", "route": "Powrót" }],
    //            "ref": "388"
    //        }
    //    },
    //    {
    //        "type": "node",
    //        "id": 259977929,
    //        "lat": 49.8125139,
    //        "lon": 19.0557542,
    //        "tags": {
    //            "name": "Żywiecka Osiedle Grunwaldzkie",
    //            "relation": [
    //                 { "line": "15", "route": "Grundwald" },
    //                 { "line": "34", "route": "Golgota" }],
    //            "ref": "388"
    //        }
    //    }],
    //    },
    //    {
    //        "Buczkowice": [{
    //            "type": "node",
    //            "id": 259977929,
    //            "lat": 49.8125139,
    //            "lon": 19.0557542,
    //            "tags": {
    //                "name": "aaaa",
    //                "relation": ["15"],
    //                "ref": "388"
    //            }
    //        }],
    //    },
    //    {
    //        "Bystra": [
    //    {
    //        "type": "node",
    //        "id": 259977929,
    //        "lat": 49.8125139,
    //        "lon": 19.0557542,
    //        "tags": {
    //            "name": "bbb",
    //            "relation": ["15"],
    //            "ref": "388"
    //        }
    //    }],
    //    },
    //    {
    //        "Meszna": [
    //    {
    //        "type": "node",
    //        "id": 259977929,
    //        "lat": 49.8125139,
    //        "lon": 19.0557542,
    //        "tags": {
    //            "name": "ccc",
    //            "relation": ["15"],
    //            "ref": "388"
    //        }
    //    }],
    //    },
    //    {
    //        "Szczyrk": [
    //    {
    //        "type": "node",
    //        "id": 259977929,
    //        "lat": 49.8125139,
    //        "lon": 19.0557542,
    //        "tags": {
    //            "name": "dddd",
    //            "relation": ["15"],
    //            "ref": "388"
    //        }
    //    }, ]
    //    }]
    //};
}]);
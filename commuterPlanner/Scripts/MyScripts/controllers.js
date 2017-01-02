﻿app.controller('AppCtrl', function ($scope) {
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

app.controller('PlanController', function ($scope) {
    $scope.myDate = new Date();
    $scope.time;

});

app.controller('ToolbarController', ['$scope', '$mdSidenav', '$mdPanel', 'BusStopService', function ($scope, $mdSidenav, $mdPanel, BusStopService) {
    $scope.init = function () {
        console.log("toolbar controller");
        BusStopService.getBusData().then(
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
}]);



app.controller('PanelController', ['$scope', '$mdPanel', 'BusStopService', 'TimeTableService', function ($scope, $mdPanel, BusStopService, TimeTableService) {

    $scope.stops = BusStopService.sendBusData();

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
        cityNo = index;
        iterations = 0;
        $scope.busLineDetails = [];
    };

    //calls getRelation() with name of selected stop
    $scope.selectStop = function (name) {
        iterations = 0;
        getRelation(name);
        $scope.busLineDetails = [];
    };

    //reads all available cities from data
    $scope.getCities = function () {

        $scope.citieslist = new Array();
        cities = $scope.stops['busStops'];
        for (var i = 0; i < cities.length; i++) {
            $scope.citieslist.push(Object.keys(cities[i])[0]);
        }
        return $scope.citieslist;
    };

    //reads stops in selected city
    $scope.getStops = function () {

        $scope.stopList = new Array();

        selectedCity = Object.keys(cities[cityNo])[0];
        cityStops = cities[cityNo][selectedCity];

        for (var i = 0; i < cityStops.length; i++) {
            var busStop = cityStops[i]['tags']['name'];

            //avoids printing duplicates in bus stop list
            if (!$scope.stopList.includes(busStop)) {
                $scope.stopList.push(busStop);
            }
        }

        //checks if getRelation() was already called, used to prevent calling fuction multiple times (!digest loop error)
        if (iterations == 0) {
            getRelation($scope.stopList[0]);
        }

        return $scope.stopList;

    };

    //reads all available bus lines for selected bus stop
    var getRelation = function (stopName) {

        iterations++;

        $scope.busLines = [];
        $scope.busNumbers = [];
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
    };

    //selected bus line to show details
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
            TimeTableService.getTimeTableData($scope.busLineDetails[i]).then(
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
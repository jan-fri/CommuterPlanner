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

app.controller('ToolbarController', function ($scope, $mdSidenav, $mdPanel) {
    $scope.toggleSidenav = function (side) {
        $mdSidenav(side).toggle();
    };

    $scope.showPan = function () {

        var position = $mdPanel.newPanelPosition()
             .absolute()
             //.top('10%')
             .center();

        var config = {
            attachTo: angular.element(document.body),
            // controller: PanelDialogCtrl,
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

});



app.controller('PanelController', function ($scope) {

    $scope.selected = 0;

    $scope.stopName = null;
    $scope.busLines = [];

    $scope.cities;

    $scope.selectedCity = function (index) {
        $scope.selected = index;
        //  console.log($scope.selected);
    };

    $scope.selectedStop = function (stopName) {
        $scope.stopName = stopName;
        console.log(stopName);
        $scope.getRelation();
        //  console.log($scope.selected);
    };

    $scope.getCities = function () {

        $scope.citieslist = new Array();
        $scope.cities = $scope.stops.busStops;
        for (var i = 0; i < $scope.cities.length; i++) {
            $scope.citieslist.push(Object.keys($scope.cities[i])[0]);
            // console.log(Object.keys($scope.stops.busStops[i])[0]);            
        }

        return $scope.citieslist;
    };

    $scope.getStops = function () {
        $scope.stopList = new Array();

        var selectedCity = Object.keys($scope.cities[$scope.selected])[0];
        var cityStops = $scope.cities[$scope.selected][selectedCity];


        for (var i = 0; i < cityStops.length; i++) {
            var busStop = cityStops[i]['tags']['name'];
            if (!$scope.stopList.includes(busStop)) {
                $scope.stopList.push(busStop);
            }
            //   $scope.stopList.push(cityStops[i]['tags']['name']);
        }
        return $scope.stopList;

    };

    $scope.getRelation = function () {


        $scope.stopList = new Array();

        var selectedCity = Object.keys($scope.cities[$scope.selected])[0];
        var cityStops = $scope.cities[$scope.selected][selectedCity];

        for (var i = 0; i < cityStops.length; i++) {
            if (cityStops[i]['tags']['name'] == $scope.stopName) {
                for (var j = 0; j < cityStops[i]['tags']['relation'].length; j++) {
                    $scope.busLines.push({
                        line: cityStops[i]['tags']['relation'][j]['line'],
                        route: cityStops[i]['tags']['relation'][j]['route'],
                        stopRef: cityStops[i]['tags']['ref']
                    });
                }
            }
        }
        
       // console.log($scope.busLines[0].line);

        //return buses;

        //$scope.busLines = {
        //    lines: []
        //};


        //for (var i = 0; i < cityStops.length; i++) {
        //    if (cityStops[i]['tags']['name'] == $scope.stopName) {
        //        for (var j = 0; j < cityStops[i]['tags']['relation'].length; j++) {
        //            //console.log(cityStops[i]['tags']['relation'].length);
        //            //console.log(cityStops[i]['tags']['relation']);

        //            $scope.busLines.lines.push({
        //                "line": cityStops[i]['tags']['relation'][j]['line'],
        //                "route": cityStops[i]['tags']['relation'][j]['route'],
        //                "stopRef": cityStops[i]['tags']['ref']
        //            });
        //            //console.log(cityStops[i]['tags']['relation'][j]['line']);
        //            //console.log(cityStops[i]['tags']['relation'][j]['route']);
        //            //console.log(cityStops[i]['tags']['ref']);
        //        }
        //    }
        //}\




        //console.log($scope.busLines[0]['line']);
        //console.log($scope.busLines[0]['route']);
        //console.log($scope.busLines[1]['line']);
        //console.log($scope.busLines[1]['route']);

        
    };



    $scope.test = function (index) {
        $scope.stopList = new Array();
        var n = Object.keys($scope.stops.busStops[0])[0];
        console.log(n);
        console.log($scope.stops.busStops[1].Buczkowice);
        console.log($scope.stops['busStops'][0][n][0]['tags']['name']);
        console.log($scope.stops['busStops'][0][n]);
        //for (var i = 0; i < $scope.cities.length; i++) {
        //    //$scope.citieslist.push($scope.stops.busStops[i]);
        //    //$scope.stopList.push(Object.keys($scope.cities[i])[0]);
        //    console.log($scope.cities[0].tags.name);
        //}

        return $scope.stopList;

    };

    $scope.stops = {
        "busStops": [
        {
            "Bielsko Biała": [{
                "type": "node",
                "id": 1437869030,
                "lat": 49.8123892,
                "lon": 19.0661571,
                "tags": {
                    "name": "Osiedle Langiewicza",
                    "relation": [
                        { "line": "15", "route": "Osiedle Polskich Skrzydeł" },
                        { "line": "34", "route": "Jakis kierunek" }],
                    "ref": "328"
                }
            },

            {
                "type": "node",
                "id": 1437869030,
                "lat": 49.8123892,
                "lon": 19.0661571,
                "tags": {
                    "name": "Osiedle Langiewicza",
                    "relation": [
                        { "line": "15", "route": "Return" },
                        { "line": "34", "route": "New" }],
                    "ref": "329"
                }
            },
        {
            "type": "node",
            "id": 259977929,
            "lat": 49.8125139,
            "lon": 19.0557542,
            "tags": {
                "name": "Żywiecka Osiedle Grunwaldzkie",
                "relation": [
                     { "line": "15", "route": "Langiewicza" },
                     { "line": "34", "route": "Powrót" }],
                "ref": "388"
            }
        },

        {
            "type": "node",
            "id": 259977929,
            "lat": 49.8125139,
            "lon": 19.0557542,
            "tags": {
                "name": "Żywiecka Osiedle Grunwaldzkie",
                "relation": [
                     { "line": "15", "route": "Grundwald" },
                     { "line": "34", "route": "Golgota" }],
                "ref": "388"
            }
        }],

        },
        {

            "Buczkowice": [{
                "type": "node",
                "id": 259977929,
                "lat": 49.8125139,
                "lon": 19.0557542,
                "tags": {
                    "name": "aaaa",
                    "relation": ["15"],
                    "ref": "388"
                }
            }],

        },
        {

            "Bystra": [
        {
            "type": "node",
            "id": 259977929,
            "lat": 49.8125139,
            "lon": 19.0557542,
            "tags": {
                "name": "bbb",
                "relation": ["15"],
                "ref": "388"
            }
        }],
        },
        {

            "Meszna": [
        {
            "type": "node",
            "id": 259977929,
            "lat": 49.8125139,
            "lon": 19.0557542,
            "tags": {
                "name": "ccc",
                "relation": ["15"],
                "ref": "388"
            }
        }],

        },
        {

            "Szczyrk": [
        {
            "type": "node",
            "id": 259977929,
            "lat": 49.8125139,
            "lon": 19.0557542,
            "tags": {
                "name": "dddd",
                "relation": ["15"],
                "ref": "388"
            }
        }, ]

        }]
    };

    //$scope.stops = {
    //    "busStops": {
    //        "Bielsko-Biała": [{
    //            "type": "node",
    //            "id": 1437869030,
    //            "lat": 49.8123892,
    //            "lon": 19.0661571,
    //            "tags": {
    //                "name": "Osiedle Langiewicza",
    //                "relation": ["15"],
    //                "ref": "329"
    //            }
    //        },
    //       {
    //           "type": "node",
    //           "id": 259977929,
    //           "lat": 49.8125139,
    //           "lon": 19.0557542,
    //           "tags": {
    //               "name": "Żywiecka Osiedle Grunwaldzkie",
    //               "relation": ["15"],
    //               "ref": "388"
    //           }
    //       }],


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



    //        "Bystra": [
    //            {
    //                "type": "node",
    //                "id": 259977929,
    //                "lat": 49.8125139,
    //                "lon": 19.0557542,
    //                "tags": {
    //                    "name": "bbb",
    //                    "relation": ["15"],
    //                    "ref": "388"
    //                }
    //            }],

    //        "Meszna": [
    //            {
    //                "type": "node",
    //                "id": 259977929,
    //                "lat": 49.8125139,
    //                "lon": 19.0557542,
    //                "tags": {
    //                    "name": "ccc",
    //                    "relation": ["15"],
    //                    "ref": "388"
    //                }
    //            }],




    //        "Szczyrk": [
    //            {
    //                "type": "node",
    //                "id": 259977929,
    //                "lat": 49.8125139,
    //                "lon": 19.0557542,
    //                "tags": {
    //                    "name": "dddd",
    //                    "relation": ["15"],
    //                    "ref": "388"
    //                }
    //            }]

    //    }
    //};

    $scope.todos = [
      {

          what: 'Brunch this weekend?',
          who: 'Min Li Chan',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'aaaaan',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'Min Li Chan',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'bbbbb',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'Min Li Chan',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'ccccc',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'Min Li Chan',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'ddddd',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {

          what: 'Brunch this weekend?',
          who: 'Min Li Chan',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
      {
          what: 'Brunch this weekend?',
          who: 'eeeeee',
          when: '3:08PM',
          notes: " I'll be in your neighborhood doing errands"
      },
    ];
});
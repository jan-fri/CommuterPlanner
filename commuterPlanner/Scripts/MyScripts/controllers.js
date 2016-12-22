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

    var selected = 0;

    var stopName;

    var cities;

    var selectedCity;
    var cityStops;

    $scope.selectCity = function (index) {
        selected = index;
    };

    $scope.selectStop = function (stopName) {
        stopName = stopName;
    };

    $scope.getCities = function () {

        $scope.citieslist = new Array();
        cities = $scope.stops.busStops;
        for (var i = 0; i < cities.length; i++) {
            $scope.citieslist.push(Object.keys(cities[i])[0]);
        }

        return $scope.citieslist;
    };

    $scope.getStops = function () {
        $scope.stopList = new Array();

        selectedCity = Object.keys(cities[selected])[0];
        cityStops = cities[selected][selectedCity];


        for (var i = 0; i < cityStops.length; i++) {
            var busStop = cityStops[i]['tags']['name'];
            if (!$scope.stopList.includes(busStop)) {
                $scope.stopList.push(busStop);
            }
        }

        stopName = $scope.stopList[0];
        console.log("GETSTOPLIST: " + $scope.stopList[0]);

        getRelation();
        return $scope.stopList;

    };

    var getRelation = function () {


        //$scope.stopList = new Array();

       // var selectedCity = Object.keys(cities[selected])[0];
        //var cityStops = cities[selected][selectedCity];

        console.log("loguje : " + cityStops.length);


        $scope.busLines = [];
        for (var i = 0; i < cityStops.length; i++) {
            if (cityStops[i]['tags']['name'] == stopName) {
                for (var j = 0; j < cityStops[i]['tags']['relation'].length; j++) {
                    $scope.busLines.push({
                        line: cityStops[i]['tags']['relation'][j]['line'],
                        route: cityStops[i]['tags']['relation'][j]['route'],
                        stopRef: cityStops[i]['tags']['ref']
                    });
                }
            }
        }
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
});
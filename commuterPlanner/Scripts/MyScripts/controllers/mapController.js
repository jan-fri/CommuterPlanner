app.controller('MapController', ['$rootScope', function ($scope, $rootScope) {

    var map = L.map('mapid').setView([49.822, 19.058], 13);

    L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var coordinates;
    var busStopNames;
    var stopArray = new Array();
    var stopLayer = L.layerGroup();
    var popupArray = new Array();
    var popupLayer = L.layerGroup();
    var lineRouteArray = new Array();
    var lineRouteLayer = L.layerGroup();

    $scope.$on('sendCoordin', function (event, obj) {
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


        customCircleMarker = L.CircleMarker.extend({
            options: {
                someCustomProperty: '',
            }
        });

        var style = { color: 'blue' }
        for (var i = 0; i < coordinates.length; i++) {
            var str = coordinates[i].split(", ");
            console.log(str[0], str[1]);
            var stop = L.circleMarker([str[0], str[1]], {
                color: 'blue',
                fillColor: '#f03',
                fillOpacity: 0.5,
                name: busStopNames[i],
                city: 'Bielsko Biała'


            })
                .bindPopup(busStopNames[i])
                .on('click', onMarkerClick);


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

    var enableClickStart = false;

    $scope.$on('selectStartLocation', function (event, obj) {
        console.log("enable click start " + obj['enableClickStart']);
        enableClickStart = obj['enableClickStart'];
    });

    function onMarkerClick(e) {
        console.log("you clicked on " + e.target.options.name + e.target.options.city);
        var name = e.target.options.name;
        var city = e.target.options.city;
        if (enableClickStart) {
            console.log("sending selected point to plan control ")
            $scope.$broadcast('startLocationSelected', { busStopName: name, cityName: city })
            enableClickStart = false;
        }
    };
}]);
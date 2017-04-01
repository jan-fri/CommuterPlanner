app.controller('MapController', ['$rootScope', '$scope', 'BusStopService', function ($rootScope, $scope, BusStopService) {
    var map = L.map('mapid').setView([49.822, 19.058], 13);

    L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var allStops;
    var coordinates = [];
    var busStopNames = [];
    var busStopRefs = [];
    var cities = [];
    var stopArray = new Array();
    var stopLayer = L.layerGroup();
    var popupArray = new Array();
    var popupLayer = L.layerGroup();
    var lineRouteArray = new Array();
    var lineRouteLayer = L.layerGroup();


    $rootScope.$on('sendCoordin', function (event, obj) {
        coordinates = obj['coordinates'];
        busStopNames = obj['busStopName'];
        busStopRefs = obj['busStopRef'];
        showRoute(true, true);

    });

    $scope.$on('dataReady', function (event, obj) {
        console.log("map controller dataready");
        init();
    });

    var init = function () {
        allStops = BusStopService.getBusData();
        console.log(allStops);
        var arrayIndex = 0;
        // console.log("length" + allStops['busStops'].length);
        for (var i = 0; i < allStops['busStops'].length; i++) {
            // console.log(allStops['busStops'][i]);
            var cityName = Object.keys(allStops['busStops'][i]);
            //  console.log(allStops['busStops'][i][cityName].length);
            for (var j = 0; j < allStops['busStops'][i][cityName].length; j++) {
                //  console.log(allStops['busStops'][i][cityName]);
                var lat = "" + allStops['busStops'][i][cityName][j]['lat'];
                var lon = "" + allStops['busStops'][i][cityName][j]['lon'];
                var latlon = lat + ", " + lon;
                var name = allStops['busStops'][i][cityName][j]['tags']['name'];
                var ref = allStops['busStops'][i][cityName][j]['tags']['ref'];

                // coordinates.push({ latlon });
                coordinates[arrayIndex] = latlon;
                busStopNames[arrayIndex] = name;
                busStopRefs[arrayIndex] = ref;

                arrayIndex++;
            }
        }

        showRoute(false, false);
        var stops = {
            "Wszystkie przystanki": stopLayer
        };
        L.control.layers(null,stops).addTo(map);
    };

    var showRoute = function (displayLines, displayPopups) {
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
        //console.log("coordinates.length " + coordinates.length);
        for (var i = 0; i < coordinates.length; i++) {
            var str = coordinates[i].split(", ");
           // console.log(str[0], str[1]);
            var stop = L.circleMarker([str[0], str[1]], {
                color: 'blue',
                fillColor: '#f03',
                fillOpacity: 0.5,
                name: busStopNames[i],
                city: 'Bielsko Biała',
                ref: busStopRefs[i]

            })
                .bindPopup(busStopNames[i])
                .on('click', onMarkerClick);


            stopArray.push(stop);

            if (displayPopups && (i == 0 || i == coordinates.length - 1)) {
                var popup = L.popup()
                                .setLatLng([str[0], str[1]])
                                .setContent(busStopNames[i]);
                popupArray.push(popup);
            }

            if (displayLines) {
                lineRouteArray.push([str[0], str[1]]);
            }
            
        }
        console.log("ba,");
        console.log(lineRouteArray);

        stopLayer = L.layerGroup(stopArray).addTo(map);
        popupLayer = L.layerGroup(popupArray).addTo(map);

        lineRouteLayer = L.polyline(lineRouteArray);
        map.addLayer(lineRouteLayer);
    };

    var enableClickStart = false;

    $rootScope.$on('selectStartLocation', function (event, obj) {
        console.log("enable click start " + obj['enableClickStart']);
        enableClickStart = obj['enableClickStart'];
    });

    function onMarkerClick(e) {
        console.log("you clicked on " + e.target.options.name + e.target.options.city + e.target.options.ref);
        var name = e.target.options.name;
        var city = e.target.options.city;
        var ref = e.target.options.ref;
        console.log("ref " + ref);
        console.log("enable click start " + enableClickStart);
        if (enableClickStart) {
            console.log("sending selected point to plan control, bus stop - " + name);
            $rootScope.$broadcast('startLocationSelected', { busStopRef: ref, busStopName: name, cityName: city })
            enableClickStart = false;
        }
    };
}]);
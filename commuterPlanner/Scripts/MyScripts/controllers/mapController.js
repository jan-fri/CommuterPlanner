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
        cities = obj['busStopCity'];
        console.log("map - coordin received");
        console.log("coord " + coordinates);
        console.log("city " + cities);
        console.log("bus stop name " + busStopNames);
        console.log("bus stop ref " + busStopRefs);
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

        for (var i = 0; i < allStops['busStops'].length; i++) {
            var cityName = Object.keys(allStops['busStops'][i]);
            for (var j = 0; j < allStops['busStops'][i][cityName].length; j++) {
                var lat = "" + allStops['busStops'][i][cityName][j]['lat'];
                var lon = "" + allStops['busStops'][i][cityName][j]['lon'];
                var latlon = lat + ", " + lon;
                var name = allStops['busStops'][i][cityName][j]['tags']['name'];
                var ref = allStops['busStops'][i][cityName][j]['tags']['ref'];

                coordinates[arrayIndex] = latlon;
                busStopNames[arrayIndex] = name;
                busStopRefs[arrayIndex] = ref;
                cities[arrayIndex] = cityName;

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


        //customCircleMarker = L.CircleMarker.extend({
        //    options: {
        //        someCustomProperty: '',
        //    }
        //});

        var style = { color: 'blue' }
        for (var i = 0; i < coordinates.length; i++) {
            var str = coordinates[i].split(", ");
            var stop = L.circleMarker([str[0], str[1]], {
                color: 'blue',
                fillColor: '#f03',
                fillOpacity: 0.5,
                name: busStopNames[i],
                city: cities[i],
                ref: busStopRefs[i]

            })
                .bindPopup("<b>" + busStopNames[i] + "</b>" + "<br>" + cities[i])
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

        stopLayer = L.layerGroup(stopArray).addTo(map);
        popupLayer = L.layerGroup(popupArray).addTo(map);

        lineRouteLayer = L.polyline(lineRouteArray);
        map.addLayer(lineRouteLayer);
    };

    var enableClickStart = false;
    var enableClickEnd = false;

    $rootScope.$on('selectStartLocation', function (event, obj) {
        enableClickStart = obj['enableClickStart'];
    });

    $rootScope.$on('selectEndLocation', function (event, obj) {
        enableClickEnd = obj['enableClickEnd'];
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
            $rootScope.$broadcast('startLocationSelected', { busStopRef: ref, cityName: city })
            enableClickStart = false;
        }
        if (enableClickEnd) {
            console.log("sending selected point to plan control, bus stop - " + name);
            $rootScope.$broadcast('endLocationSelected', { busStopRef: ref, cityName: city })
            enableClickEnd = false;
        }
    };
}]);
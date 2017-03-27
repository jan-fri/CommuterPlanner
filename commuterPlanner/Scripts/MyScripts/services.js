app.service('BusStopService', function ($http, $q) {

    var busStops;

    return {

        receiveBusData: function () {
            var deferred = $q.defer();
            console.log("check data");
            $http({ method: 'GET', url: '/Content/data/busStops.json' })
            .success(deferred.resolve)
            .error(deferred.reject);

            busStops = deferred.promise;
            return deferred.promise;
        },

        getBusData: function () {
            return busStops.$$state.value;
        }
    };
});

app.factory('TimeTableService', function ($http, $q) {
    var timeTable;
    var busTimeTable = new Array();

    return {
        receiveTimeTableData: function (busLineDetails) {
            console.log("service");

            var deferred = $q.defer();

            $http({ method: 'GET', url: '/Home/GetBusTimeTable', params: { busNo: busLineDetails.line, busStopRef: busLineDetails.stopRef } })
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;
        },

        getTimeTableData: function () {
            return timeTable;
        }
    };
});

app.factory('DataDisplayService', function () {
    return {
        getCities: function (stops, citieslist) {
            var cities = stops['busStops'];
            for (var i = 0; i < cities.length; i++) {
                citieslist.push(Object.keys(cities[i])[0]);
            }
            return cities;
        },

        getStops: function (cities, cityNo, selectedCity) {

            var stopList = new Array();
            var cityStops = cities[cityNo][selectedCity];

            for (var i = 0; i < cityStops.length; i++) {
                var busStop = cityStops[i]['tags']['name'];

                //avoids printing duplicates in bus stop list
                if (!stopList.includes(busStop)) {
                    stopList.push(busStop);
                }
            }
            return stopList;
        },

        getRefs: function (cities, cityNo, selectedCity, selectedName) {

            var stopRefs = new Array();
            var cityStops = cities[cityNo][selectedCity];

            for (var i = 0; i < cityStops.length; i++) {

                var stopName = cityStops[i]['tags']['name'];
                if (stopName == selectedName) {
                    stopRefs.push(cityStops[i]['tags']['ref']);
                }
            }
            console.log(stopRefs);
            return stopRefs;
        }
    }
});

app.factory('RouteSelectionService', function ($http, $q) {
    return {
        receiveRoutes: function (startStopRefs, endStopRefs, day, time) {
            console.log("route selection service");

            var deferred = $q.defer();

            $http({ method: 'GET', url: '/Home/GetRoute', params: { busStopA: startStopRefs, busStopB: endStopRefs, selectedTravelDay: day, selectedTravelTime: time } })
            .success(deferred.resolve)
            .error(deferred.reject);

            return deferred.promise;
        }

    };
});

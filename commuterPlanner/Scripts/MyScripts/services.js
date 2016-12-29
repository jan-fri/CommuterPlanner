app.factory('BusStopService', function ($http, $q) {

    var busStops;

    return {
        getBusData: function () {
            var deferred = $q.defer();

            $http({ method: 'GET', url: '/Content/data/busStops.json' })
            .success(deferred.resolve)
            .error(deferred.reject);

            busStops = deferred.promise;

            return deferred.promise;
        },

        sendBusData: function () {
            return busStops.$$state.value;
        }
    };
});

app.factory('TimeTableService', function ($http, $q) {
    var timeTable;

    return {
        getTimeTableData: function (busStopRef, busNo) {
            var deferred = $q.defer();

            $http({ method: 'GET', url: '/Home/GetBusTimeTable', params: {} })
            .success(deferred.resolve)
            .error(deferred.reject);

            timeTable = deferred.promise;

            return deferred.promise;
        },

        sendTimeTableData: function () {
            return timeTable.$$state.value;
        }
    };
});
//app.service('dataService', function () {
//    this.busStopData = [];
//    this.addStopData = function (data) {
//        busStopData = data;
//        console.log("sent data " + data);
//    };
//    this.getStopData = function () {
//        return busStopData;
//    };






//});
app.factory('BusService', function ($http, $q) {

    var data;


    return {
        getBusData: function () {
            var deferred = $q.defer();

            $http({ method: 'GET', url: '/Content/data/busStops.json' })
            .success(deferred.resolve)
            .error(deferred.reject);

            data = deferred.promise;

            return deferred.promise; 
        },

        sendBusData: function () {
            return data.$$state.value;
        }
    };
});



app.service('dataService', function () {
    this.busStopData = [];
    this.addStopData = function (data) {
        busStopData = data;
        console.log("sent data " + data);
    };
    this.getStopData = function () {
        return busStopData;
    };






});
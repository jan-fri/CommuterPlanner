app.service('BusStopService', function ($http, $q) {

    var busStops;

    return {
        receiveBusData: function () {
            var deferred = $q.defer();
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
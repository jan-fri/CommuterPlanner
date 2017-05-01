app.factory('RouteSelectionService', function ($http, $q) {
    return {
        receiveRoutes: function (startStopRefs, endStopRefs, day, time) {
            var deferred = $q.defer();
            $http({ method: 'GET', url: '/Home/GetRoute', params: { busStopA: startStopRefs, busStopB: endStopRefs, selectedTravelDay: day, selectedTravelTime: time } })
            .success(deferred.resolve)
            .error(deferred.reject);

            return deferred.promise;
        }

    };
});

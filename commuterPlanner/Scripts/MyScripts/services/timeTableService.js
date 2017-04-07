app.factory('TimeTableService', function ($http, $q) {
    var timeTable;
    var busTimeTable = new Array();

    return {
        receiveTimeTableData: function (busLineDetails) {
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
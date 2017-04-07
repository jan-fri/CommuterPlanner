app.controller('AppCtrl', ['$scope', 'BusStopService', function ($scope, BusStopService) {
    init = function () {
        BusStopService.receiveBusData().then(
            function (data) {
                $scope.$broadcast('dataReady');
            },
            function () {
                alert('error while fetching data from server')
            });
    };
    
    init();
}]);
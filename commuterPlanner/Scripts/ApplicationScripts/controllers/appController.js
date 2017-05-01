app.controller('AppCtrl', ['$scope', 'BusStopService', function ($scope, BusStopService) {
    init = function () {
        console.log("appctrl init")
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
app.controller('AppCtrl', ['$scope', 'BusStopService', function ($scope, BusStopService) {
    init = function () {
        console.log("app ctrl ");
        BusStopService.receiveBusData().then(
            function (data) {
                console.log("App ctrl data received, broadcasting");
                //init2();     
                $scope.$broadcast('dataReady');
            },
            function () {
                alert('error while fetching data from server')
            });
    };
    
    init();
}]);
app.controller('PanelController', ['$scope', '$mdPanel', 'BusStopService', 'TimeTableService', 'DataDisplayService', function ($scope, $mdPanel, BusStopService, TimeTableService, DataDisplayService) {

    $scope.stops = BusStopService.getBusData();

    //list of all available cities 
    var cities;
    //index number of selected city from list 
    var cityNo = 0;
    //name of selected city
    var selectedCity;
    //list of all stops is given city
    var cityStops;

    //variable used to prevent calling fuction multiple times (!digest loop error)
    var iterations = 0;

    //set index number of selected city
    $scope.selectCity = function (index) {
        console.log("index num " + index);
        cityNo = index;
        iterations = 0;
        $scope.busLineDetails = [];
    };

    //calls getRelation() with name of selected stop
    $scope.selectStop = function (name) {
        console.log("selectStop");
        iterations = 0;
        getRelation(name);
        $scope.busLineDetails = [];
    };

    //reads all available cities from data
    $scope.getCities = function () {

        $scope.citieslist = new Array();
        cities = DataDisplayService.getCities($scope.stops, $scope.citieslist);
        console.log("stops " + $scope.stops);
        console.log("get cities " + cities);
        return $scope.citieslist;
    };

    //reads stops in selected city
    $scope.getStops = function () {

        var stopList = new Array();

        selectedCity = Object.keys(cities[cityNo])[0];
        cityStops = cities[cityNo][selectedCity];

        stopList = DataDisplayService.getStops(cities, cityNo, selectedCity);

        //checks if getRelation() was already called, used to prevent calling fuction multiple times (!digest loop error)
        if (iterations == 0) {
            getRelation(stopList[0]);
        }
        return stopList;

    };

    //reads all available bus lines for selected bus stop
    var getRelation = function (stopName) {
        console.log("getRelation");
        iterations++;

        $scope.busLines = [];
        $scope.busNumbers = [];
        //console.log("stop name " + stopName);
        //console.log("city stops " + cityStops + "length " + cityStops.length);

        //DataDisplayService.getRelations($scope.busLines, $scope.busNumbers, cityStops, stopName)
        for (var i = 0; i < cityStops.length; i++) {

            if (cityStops[i]['tags']['name'] == stopName) {
                for (var j = 0; j < cityStops[i]['tags']['relation'].length; j++) {
                    var line = cityStops[i]['tags']['relation'][j]['line'];
                    $scope.busLines.push({
                        line: line,
                        route: cityStops[i]['tags']['relation'][j]['route'],
                        stopRef: cityStops[i]['tags']['ref']
                    });

                    //avoids printing duplicates in bus lines list
                    if (!$scope.busNumbers.includes(line)) {
                        $scope.busNumbers.push(line);
                    }
                }
            }
        }

        //console.log("lines");
        //console.log($scope.busLines);
    };

    //show details for selected bus line
    $scope.seletBus = function (index) {

        $scope.busLineDetails = [];
        for (var i = 0; i < $scope.busLines.length; i++) {
            if ($scope.busLines[i]['line'] == $scope.busNumbers[index]) {
                $scope.busLineDetails.push({
                    line: $scope.busLines[i]['line'],
                    route: $scope.busLines[i]['route'],
                    stopRef: $scope.busLines[i]['stopRef']
                });
            }
        };

        //console.log($scope.busLineDetails);
        //console.log("dlugosc");
        //console.log($scope.busLineDetails.length);


        //$scope.busTimeTable = TimeTableService.receiveTimeTableData($scope.busLineDetails);
        $scope.busTimeTable = [];
        for (var i = 0; i < $scope.busLineDetails.length; i++) {
            console.log($scope.busLineDetails[i]);
            TimeTableService.receiveTimeTableData($scope.busLineDetails[i]).then(
                function (data) {
                    console.log("tt data");
                    console.log(data);
                    $scope.busTimeTable.push({
                        workingDay: data[0],
                        saturday: data[1],
                        sunday: data[2]
                    });
                    //console.log("workingDay");
                    //console.log($scope.busTimeTable[0].workingDay);
                },
                function () {
                    alert('error while fetching speakers from server')
                });
        };

    }
}]);
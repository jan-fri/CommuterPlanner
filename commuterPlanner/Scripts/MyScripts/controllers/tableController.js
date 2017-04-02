app.controller('tableController', ['$scope', '$mdPanel', 'BusStopService', 'TimeTableService', 'DataDisplayService', function ($scope, $mdPanel, BusStopService, TimeTableService, DataDisplayService) {

    //all available bus stop data
    var allStops;
    //bus stops in cities
    var cityBusStopList;

    var init = function () {
        console.log("init in table controller...");

        allStops = BusStopService.getBusData();
        console.log("stops in table controller " + allStops);
        getCities();
        getStops();
    };    

    var getCities = function () {
        //names of available cities to display
        $scope.cityNames = new Array();

        cityBusStopList = DataDisplayService.getCities(allStops, $scope.cityNames);
        console.log("cityBusStopList in table contr " + cityBusStopList);
        console.log("citiesList in table contr " + $scope.cityNames);
    };

    //index number of selected city from list 
    var cityNo = 0;
    //variable used to prevent calling fuction multiple times (!digest loop error)
    var iterations = 0;
    //name of selected city
    var selectedCity;
    //list of all stops is given city
    var cityStops;

    //set index number of selected city
    $scope.selectCity = function (index) {
        console.log("index num " + index);
        cityNo = index;
        iterations = 0;

        //clear bus line details array from earlier selection
        $scope.busLineDetails = [];
        getStops();
    };
    
    //reads stops in selected city
    var getStops = function () {
        $scope.stopList = new Array();

        //selectedCity = Object.keys(cityBusStopList[cityNo])[0];
        selectedCity = $scope.cityNames[cityNo];        
        cityStops = cityBusStopList[cityNo][selectedCity];

        $scope.stopList = DataDisplayService.getStops(cityBusStopList, selectedCity);

        //checks if getRelation() was already called, used to prevent calling fuction multiple times (!digest loop error)
        if (iterations == 0) {
            getRelation($scope.stopList[0]);
        }
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

    };
    //calls getRelation() with name of selected stop
    $scope.selectStop = function (name) {
        console.log("selectStop");
        iterations = 0;
        getRelation(name);
        $scope.busLineDetails = [];
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
        console.log("in select bus ... bus line details")
        console.log($scope.busLineDetails);
        console.log("length of bus line details ");
        console.log($scope.busLineDetails.length);


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
    init();
}]);

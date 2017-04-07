app.factory('DataDisplayService', function () {
    return {
        getCities: function (stops, citiesList) {
            var cities = stops['busStops'];
            for (var i = 0; i < cities.length; i++) {
                citiesList.push(Object.keys(cities[i])[0]);
            }
            return cities;
        },

        getStops: function (cities, selectedCity) {
            var stopList = new Array();
            var cityIndex = this.getCityIndex(cities, selectedCity);
            var cityStops = cities[cityIndex][selectedCity];
            for (var i = 0; i < cityStops.length; i++) {
                var busStop = cityStops[i]['tags']['name'];

                //avoids printing duplicates in bus stop list
                if (!stopList.includes(busStop)) {
                    stopList.push(busStop);
                }
            }
            return stopList;
        },

        getRefs: function (cities, selectedCity, selectedName) {

            var stopRefs = new Array();
            var cityIndex = this.getCityIndex(cities, selectedCity);
            var cityStops = cities[cityIndex][selectedCity];

            for (var i = 0; i < cityStops.length; i++) {

                var stopName = cityStops[i]['tags']['name'];
                if (stopName == selectedName) {
                    stopRefs.push(cityStops[i]['tags']['ref']);
                }
            }
            return stopRefs;
        },

        getBusStopNamebyRef: function (cities, selectedCity, refNo){
            var busStopName;

            var cityIndex = this.getCityIndex(cities, selectedCity);
            var cityStops = cities[cityIndex][selectedCity];

            for (var i = 0; i < cityStops.length; i++) {
                var stopRef = cityStops[i]['tags']['ref'];
                if (stopRef == refNo) {
                    busStopName = cityStops[i]['tags']['name'];
                    break;
                }
            }
            return busStopName;
        },

        getCityIndex: function (cities, selectedCity) {
            var cityIndex;
            for (var i = 0; i < cities.length; i++) {
                if (Object.keys(cities[i]) == selectedCity) {
                    cityIndex = i;
                }
            }
            return cityIndex;
        }
    }
});